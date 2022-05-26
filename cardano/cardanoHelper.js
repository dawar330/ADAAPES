import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import fromHex, { toHex } from "./hex";
import cardano from "./blockfrost.js";
import contract from "./plutus";

export const fromBech32 = async (bech32) => {
  return Cardano.BaseAddress.from_address(Cardano.Address.from_bech32(bech32));
};

export const fromLovelace = (lovelace) => lovelace / 1000000;

export const toLovelace = (ada) => ada * 1000000;

export const toString = (bytes) => String.fromCharCode.apply(String, bytes);

export const serializeTxUnspentOutput = async (hexEncodedBytes) => {
  try {
    return Cardano.TransactionUnspentOutput.from_bytes(
      fromHex(hexEncodedBytes)
    );
  } catch (error) {
    console.error(
      `Unexpected error in serializeTxUnspentOutput. [Message: ${error}]`
    );
  }
};
export const createTxUnspentOutput = async (address, utxo) => {
  try {
    return Cardano.TransactionUnspentOutput.new(
      Cardano.TransactionInput.new(
        Cardano.TransactionHash.from_bytes(fromHex(utxo.tx_hash)),
        utxo.output_index
      ),
      Cardano.TransactionOutput.new(address, assetsToValue(utxo.amount))
    );
  } catch (error) {
    console.error(
      `Unexpected error in createTxUnspentOutput. [Message: ${error.message}]`
    );
  }
};
export const finalizeTxBack = async (tx) => {
  //get Cardano serialization instance

  const Parameters = getProtocolParameters();
  const transactionWitnessSet = Cardano.TransactionWitnessSet.new();
  tx = Cardano.Transaction.from_bytes(fromHex(tx));

  const size = tx.to_bytes().length * 2;
  if (size > Parameters.maxTxSize) throw new Error(ErrorTypes.MAX_SIZE_REACHED);

  let txVkeyWitnesses = await window.cardano.signTx(
    Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
    true
  );
  txVkeyWitnesses = Cardano.TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, "hex")
  );

  transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

  const signedTx = Cardano.Transaction.new(
    tx.body(),
    Cardano.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    tx.auxiliary_data()
  );
  const txHash = await window.cardano.submitTx(toHex(signedTx.to_bytes()));

  return txHash;
};

export const createTxOutput = async (address, value, { datum } = {}) => {
  //get Cardano serialization instance

  const minAda = Cardano.min_ada_required(
    value,
    Cardano.BigNum.from_str(getProtocolParameters().coinsPerUtxoWord),
    datum && Cardano.hash_plutus_data(datum)
  );

  if (minAda.compare(value.coin()) === 1) value.set_coin(minAda);

  const output = Cardano.TransactionOutput.new(address, value);

  if (datum) {
    output.set_data_hash(Cardano.hash_plutus_data(datum));
  }

  return output;
};

export const getProtocolParameters = async () => {
  try {
    var response = await cardano(`epochs/latest/parameters`);

    return {
      linearFee: {
        minFeeA: "50",
        minFeeB: response.min_fee_b.toString(),
      },
      minUtxo: response.min_utxo,
      poolDeposit: response.pool_deposit,
      keyDeposit: response.key_deposit,
      maxValSize: parseInt(response.max_val_size),
      maxTxSize: parseInt(response.max_tx_size),
      priceMem: parseFloat(response.price_mem),
      priceStep: parseFloat(response.price_step),
      coinsPerUtxoWord: response.coins_per_utxo_word,
    };
  } catch (error) {
    console.error(
      `Unexpected error in getProtocolParameters. [Message: ${error.message}]`
    );
  }
};

export const initializeTx = async () => {
  const metadata = {};
  const Parameters = await getProtocolParameters();
  var TransactionBuilderConfig = Cardano.TransactionBuilderConfigBuilder.new()
    .fee_algo(
      Cardano.LinearFee.new(
        Cardano.BigNum.from_str(Parameters.linearFee.minFeeA),
        Cardano.BigNum.from_str(Parameters.linearFee.minFeeB)
      )
    )
    .coins_per_utxo_word(Cardano.BigNum.from_str(Parameters.coinsPerUtxoWord))
    .pool_deposit(Cardano.BigNum.from_str(Parameters.poolDeposit))
    .key_deposit(Cardano.BigNum.from_str(Parameters.keyDeposit))
    .max_value_size(Parameters.maxValSize)
    .max_tx_size(Parameters.maxTxSize)
    .build();
  const txBuilder = Cardano.TransactionBuilder.new(TransactionBuilderConfig);
  const datums = Cardano.PlutusList.new();

  const outputs = Cardano.TransactionOutputs.new();

  return { metadata, txBuilder, datums, outputs };
};

export const finalizeTx = async ({
  txBuilder,
  changeAddress,
  utxos,
  outputs,
  datums,
  generalMetadata,
  action,
  assetUtxo,
  plutusScripts,
}) => {
  const Parameters = getProtocolParameters();

  for (let i = 0; i < outputs.len(); i++) {
    txBuilder.add_output(outputs.get(i));
  }
  if (assetUtxo) {
    console.log("Asset UTXO: ", assetUtxo);
    var scriptInput = await createTxUnspentOutput(
      Cardano.Address.from_bech32(contract.address),
      assetUtxo[0]
    );
    utxos.add(scriptInput);
  }

  let aux_data;
  if (generalMetadata) {
    aux_data = Cardano.AuxiliaryData.new();
    aux_data.set_metadata(generalMetadata);
    txBuilder.set_auxiliary_data(aux_data);
  }

  // Adding Inputs From Coin Seletion
  try {
    txBuilder.add_inputs_from(
      utxos,
      Cardano.CoinSelectionStrategyCIP2.RandomImproveMultiAsset
    );
    txBuilder.add_change_if_needed(changeAddress);

    if (assetUtxo) {
      txBuilder.add_script_input(
        contractScriptHash(),
        scriptInput.input(),
        assetsToValue(assetUtxo[0].amount)
      );
    }
    txBuilder.set_fee(Cardano.BigNum.from_str("400000"));
  } catch (error) {
    console.log(error);
  }

  const transation = txBuilder.build_tx();
  let txbody = transation.body();
  const collateral = Cardano.TransactionInputs.new();

  const colateral = (await window.cardano.getCollateral()).map((utxo) =>
    collateral.add(
      Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)).input()
    )
  );
  txbody.set_collateral(collateral);
  const requiredSigners = Cardano.Ed25519KeyHashes.new();
  requiredSigners.add(
    Cardano.BaseAddress.from_address(changeAddress).payment_cred().to_keyhash()
  );

  txbody.set_required_signers(requiredSigners);
  const costmdls = Cardano.Costmdls.new();
  const arr = [
    197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736,
    29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773,
    100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000,
    0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000,
    1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000,
    150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1,
    150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1,
    150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
    148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000,
    425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0,
    82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32,
    150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
    3345831, 1, 1,
  ];

  const costModel = Cardano.CostModel.new();
  arr.forEach((x, i) => {
    costModel.set(i, Cardano.Int.new_i32(x));
  });
  costmdls.insert(Cardano.Language.new_plutus_v1(), costModel);

  console.log(toHex(costmdls.to_bytes()));
  let redeemers = Cardano.Redeemers.new();

  const redeemerData = Cardano.PlutusData.new_integer(
    Cardano.BigInt.from_str("0")
  );
  redeemers.add(
    Cardano.Redeemer.new(
      Cardano.RedeemerTag.new_spend(),
      Cardano.BigNum.from_str("1"),
      redeemerData,
      Cardano.ExUnits.new(
        Cardano.BigNum.from_str("7000000"),
        Cardano.BigNum.from_str("3000000000")
      )
    )
  );
  const WitnessesSet = transation.witness_set();
  WitnessesSet.set_plutus_data(datums);
  WitnessesSet.set_plutus_scripts(contractScripts());

  WitnessesSet.set_redeemers(redeemers);
  const scriptHash = Cardano.hash_script_data(redeemers, costmdls, datums);
  console.log(toHex(scriptHash.to_bytes()));
  txbody.set_script_data_hash(scriptHash);

  const size = transation.to_bytes().length * 1.5;
  if (size > Parameters.maxTxSize) throw new Error(ErrorTypes.MAX_SIZE_REACHED);

  let txVkeyWitnesses = await window.cardano.signTx(
    toHex(
      Cardano.Transaction.new(
        txbody,
        WitnessesSet,
        transation.auxiliary_data()
      ).to_bytes()
    ),
    true
  );
  console.log(txVkeyWitnesses);

  WitnessesSet.set_vkeys(
    Cardano.TransactionWitnessSet.from_bytes(fromHex(txVkeyWitnesses)).vkeys()
  );

  const signedTx = Cardano.Transaction.new(
    transation.body(),
    WitnessesSet,
    transation.auxiliary_data()
  );

  const txHash = await window.cardano.submitTx(toHex(signedTx.to_bytes()));

  return txHash;
};

export const BUYER = (index) => {
  //get Cardano serialization instance

  const data = Cardano.PlutusData.new_constr_plutus_data(
    Cardano.ConstrPlutusData.new(
      Cardano.BigNum.from_str("0"),
      Cardano.PlutusList.new()
    )
  );

  const redeemer = Cardano.Redeemer.new(
    Cardano.RedeemerTag.new_spend(),
    Cardano.BigNum.from_str("1"),
    data,
    Cardano.ExUnits.new(
      Cardano.BigNum.from_str("7000000"),
      Cardano.BigNum.from_str("3000000000")
    )
  );

  return redeemer;
};

export const assetsToValue = (assets) => {
  //get Cardano serialization instance

  const multiAsset = Cardano.MultiAsset.new();
  const lovelace = assets.find((asset) => asset.unit === "lovelace");
  const policies = [
    ...new Set(
      assets
        .filter((asset) => asset.unit !== "lovelace")
        .map((asset) => asset.unit.slice(0, 56))
    ),
  ];
  policies.forEach((policy) => {
    const policyAssets = assets.filter(
      (asset) => asset.unit.slice(0, 56) === policy
    );
    const assetsValue = Cardano.Assets.new();
    policyAssets.forEach((asset) => {
      assetsValue.insert(
        Cardano.AssetName.new(fromHex(asset.unit.slice(56))),
        Cardano.BigNum.from_str(asset.quantity)
      );
    });
    multiAsset.insert(
      Cardano.ScriptHash.from_bytes(fromHex(policy)),
      assetsValue
    );
  });
  const value = Cardano.Value.new(
    Cardano.BigNum.from_str(lovelace ? lovelace.quantity : "0")
  );
  if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset);
  return value;
};

export const serializeSale = ({ tn, cs, beneficiary, deadline }) => {
  const fields = Cardano.PlutusList.new();

  fields.add(Cardano.PlutusData.new_bytes(fromHex(beneficiary)));
  fields.add(Cardano.PlutusData.new_bytes(fromHex(deadline)));
  fields.add(Cardano.PlutusData.new_bytes(fromHex(cs)));
  fields.add(Cardano.PlutusData.new_bytes(fromHex(tn)));

  const datum = Cardano.PlutusData.new_constr_plutus_data(
    Cardano.ConstrPlutusData.new(Cardano.BigNum.from_str("0"), fields)
  );

  return datum;
};

export const deserializeSale = (datum) => {
  const details = datum.as_constr_plutus_data().data();

  return {
    tn: toHex(details.get(3).as_bytes()),
    cs: toHex(details.get(2).as_bytes()),
    sa: toHex(details.get(0).as_bytes()),
    ra: toHex(details.get(4).as_bytes()),
    rp: details.get(5).as_integer().to_str(),
    price: details.get(1).as_integer().to_str(),
  };
};

export const getLockedUtxosByAsset = async (address, asset) => {
  try {
    return await cardano(`addresses/${address}/utxos/${asset}`);
  } catch (error) {
    console.error(
      `Unexpected error in getLockedUtxosByAsset. [Message: ${error.message}]`
    );
    throw new Error(ErrorTypes.COULD_NOT_FETCH_ASSET_UTXOS);
  }
};

export const contractScripts = () => {
  const scripts = Cardano.PlutusScripts.new();

  scripts.add(Cardano.PlutusScript.new(fromHex(contract.cborHex)));

  return scripts;
};
export const contractScriptHash = () => {
  return Cardano.ScriptHash.from_bytes(
    fromHex("a9ae7ace295ebce61a216f1b6ca071231188d3534fd109ce22ceb0b0")
  );
};
