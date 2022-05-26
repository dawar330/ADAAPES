import {
  assetsToValue,
  BUYER,
  contractScripts,
  finalizeTx,
  fromBech32,
  initializeTx,
  serializeSale,
  serializeTxUnspentOutput,
} from "./cardanoHelper";

import * as Cardano from "@emurgo/cardano-serialization-lib-asmjs";
import fromHex, { toHex } from "./hex";
import contract from "./plutus";

export const transferAda = async (price, buyer) => {
  try {
    //get Cardano serialization instance

    var { txBuilder, datums, outputs } = await initializeTx();
    var buyer = {
      address: await window.cardano.getUsedAddresses(),
      utxos: await window.cardano.getUtxos(),
    };
    var utxos = Cardano.TransactionUnspentOutputs.new();
    buyer.utxos.forEach(async (utxo) => {
      console.log("Adding :", utxo);
      let utxo_seril = await serializeTxUnspentOutput(utxo);
      utxos.add(utxo_seril);
    });
    var beachAddress = await fromBech32(
      "addr_test1qp0yjfdqr95wxye87we28lqxxm7puh5hge43ufgcryf3y54wzf2qyvnxkn7rfmxvvy2e2jvs9tjyk2688sseacka8m2q776ef8"
    );

    txBuilder.add_output(
      Cardano.TransactionOutputBuilder.new()
        .with_address(beachAddress.to_address())
        .next()
        .with_coin(Cardano.BigNum.from_str(price.toString()))
        .build()
    );

    const generalMetadata = Cardano.GeneralTransactionMetadata.new();
    generalMetadata.insert(
      Cardano.BigNum.from_str("100"),
      Cardano.encode_json_str_to_metadatum(JSON.stringify({}), 1)
    );
    txBuilder.add_inputs_from(
      utxos,
      Cardano.CoinSelectionStrategyCIP2.LargestFirst
    );
    txBuilder.add_change_if_needed(
      Cardano.Address.from_bytes(fromHex(buyer.address[0]))
    );

    const aux_data = Cardano.AuxiliaryData.new();
    aux_data.set_metadata(generalMetadata);
    txBuilder.set_auxiliary_data(aux_data);
    const transation = txBuilder.build_tx();
    let txbody = transation.body();
    const collateral = Cardano.TransactionInputs.new();

    const colateral = (await window.cardano.getCollateral()).map((utxo) =>
      collateral.add(
        Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)).input()
      )
    );
    txbody.set_collateral(collateral);
    let txVkeyWitnesses = await window.cardano.signTx(
      toHex(transation.to_bytes()),
      true
    );
    console.log(txVkeyWitnesses);
    let WitnessesSet = Cardano.TransactionWitnessSet.new();
    WitnessesSet.set_vkeys(
      Cardano.TransactionWitnessSet.from_bytes(fromHex(txVkeyWitnesses)).vkeys()
    );

    const signedTx = Cardano.Transaction.new(
      transation.body(),
      WitnessesSet,
      transation.auxiliary_data()
    );

    const txHash = await window.cardano.submitTx(toHex(signedTx.to_bytes()));

    // const txHash = await finalizeTx({
    //   txBuilder,
    //   utxos,
    //   outputs,
    //   datums,
    //   generalMetadata,
    //   changeAddress: Cardano.Address.from_bytes(fromHex(buyer.address[0])),
    //   action: BUYER,
    // });

    return { txHash: txHash, error: null };
  } catch (error) {
    console.log(error, "purchasePacks");
    return { txHash: null, error: error };
  }
};
export const unStakeNFT = async (datum, assetUtxo) => {
  try {
    //get Cardano serialization instance
    var { txBuilder, datums, outputs } = await initializeTx();

    var address = await window.cardano.getUsedAddresses();
    var rawUtxos = await window.cardano.getUtxos();
    var utxos = Cardano.TransactionUnspentOutputs.new();
    rawUtxos.forEach(async (utxo) => {
      let utxo_seril = await serializeTxUnspentOutput(utxo);
      utxos.add(utxo_seril);
    });
    datums.add(serializeSale(datum));
    var DatumHash = Cardano.hash_plutus_data(serializeSale(datum));

    console.log("DATUM", toHex(DatumHash.to_bytes()));

    const multiAsset = Cardano.MultiAsset.new();
    const assets = Cardano.Assets.new();
    assets.insert(
      Cardano.AssetName.new(fromHex(datum.tn)),
      Cardano.BigNum.from_str("1")
    );
    multiAsset.insert(
      Cardano.ScriptHash.from_bytes(
        fromHex("fbf57de82bc349f0208991b04a775c80238a20b757459dd9eab07507")
      ),
      assets
    );
    outputs.add(
      Cardano.TransactionOutputBuilder.new()
        .with_address(Cardano.Address.from_bytes(fromHex(address[0])))
        .next()
        .with_coin_and_asset(Cardano.BigNum.from_str("2000000"), multiAsset)
        .build()
    );

    const generalMetadata = Cardano.GeneralTransactionMetadata.new();
    generalMetadata.insert(
      Cardano.BigNum.from_str("100"),
      Cardano.encode_json_str_to_metadatum(JSON.stringify({}), 1)
    );

    const txHash = await finalizeTx({
      txBuilder,
      utxos,
      outputs,
      datums,
      generalMetadata,
      assetUtxo: assetUtxo,
      changeAddress: Cardano.Address.from_bytes(fromHex(address[0])),
      plutusScripts: contractScripts(),
      action: BUYER,
    });

    return { txHash: txHash, error: null };
  } catch (error) {
    console.log(error, "purchasePacks");
    return { txHash: null, error: error };
  }
};
export async function buildRedeemTokenFromPlutusScript(Datum, assetUtxo) {
  var { txBuilder, datums, outputs } = await initializeTx();
  const ScriptAddress = Cardano.Address.from_bech32(contract.address);
  const address = await window.cardano.getUsedAddresses();

  const shelleyChangeAddress = Cardano.Address.from_bytes(fromHex(address[0]));

  let multiAsset = Cardano.MultiAsset.new();
  let assets = Cardano.Assets.new();
  assets.insert(
    Cardano.AssetName.new(Buffer.from(Datum.tn)), // Asset Name
    Cardano.BigNum.from_str("1") // How much to send
  );

  multiAsset.insert(
    Cardano.ScriptHash.from_bytes(
      Buffer.from(
        "fbf57de82bc349f0208991b04a775c80238a20b757459dd9eab07507",
        "hex"
      )
    ), // PolicyID
    assets
  );

  txBuilder.add_input(
    ScriptAddress,
    Cardano.TransactionInput.new(
      Cardano.TransactionHash.from_bytes(
        Buffer.from(
          "5cbc58693b0e01f1874088e64b55a682d49ae4dd98f0143b598807f063a93362",
          "hex"
        )
      ),
      "0"
    ),
    Cardano.Value.new_from_assets(multiAsset)
  ); // how much lovelace is at that UTXO

  txBuilder.set_fee(Cardano.BigNum.from_str(Number(900000).toString()));

  const scripts = Cardano.PlutusScripts.new();
  scripts.add(
    Cardano.PlutusScript.from_bytes(Buffer.from(contract.cborHex, "hex"))
  ); //from cbor of plutus script

  // Add outputs
  const outputVal = 2000000 - Number(900000);
  const outputValStr = outputVal.toString();

  let txOutputBuilder = Cardano.TransactionOutputBuilder.new();
  txOutputBuilder = txOutputBuilder.with_address(shelleyChangeAddress);
  txOutputBuilder = txOutputBuilder.next();
  txOutputBuilder = txOutputBuilder.with_coin_and_asset(
    Cardano.BigNum.from_str("2000000"),
    multiAsset
  );

  const txOutput = txOutputBuilder.build();
  txBuilder.add_output(txOutput);

  // once the transaction is ready, we build it to get the tx body without witnesses
  const txBody = txBuilder.build();
  const CollatUtxos = [];
  const rawcollateral = await window.cardano.getCollateral();
  for (const x of rawcollateral) {
    const utxo = Cardano.TransactionUnspentOutput.from_bytes(
      Buffer.from(x, "hex")
    );
    CollatUtxos.push(utxo);
    // console.log(utxo)
  }

  const inputs = Cardano.TransactionInputs.new();
  CollatUtxos.forEach((utxo) => {
    inputs.add(utxo.input());
  });

  // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
  console.log(datums, serializeSale(Datum));
  datums.add(serializeSale(Datum));
  console.log(datums);

  const redeemers = Cardano.Redeemers.new();

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

  redeemers.add(redeemer);

  // Tx witness
  const transactionWitnessSet = Cardano.TransactionWitnessSet.new();

  transactionWitnessSet.set_plutus_scripts(scripts);
  transactionWitnessSet.set_plutus_data(datums);
  transactionWitnessSet.set_redeemers(redeemers);

  const cost_model_vals = [
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
  cost_model_vals.forEach((x, i) => costModel.set(i, Cardano.Int.new_i32(x)));

  const costModels = Cardano.Costmdls.new();
  costModels.insert(Cardano.Language.new_plutus_v1(), costModel);

  const scriptDataHash = Cardano.hash_script_data(
    redeemers,
    costModels,
    datums
  );
  txBody.set_script_data_hash(scriptDataHash);

  txBody.set_collateral(inputs);

  const baseAddress = Cardano.BaseAddress.from_address(shelleyChangeAddress);
  const requiredSigners = Cardano.Ed25519KeyHashes.new();
  requiredSigners.add(baseAddress.payment_cred().to_keyhash());

  txBody.set_required_signers(requiredSigners);

  const tx = Cardano.Transaction.new(
    txBody,
    Cardano.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
  );

  let txVkeyWitnesses = await window.cardano.signTx(
    Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
    true
  );
  txVkeyWitnesses = Cardano.TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, "hex")
  );

  transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

  const signedTx = Cardano.Transaction.new(tx.body(), transactionWitnessSet);

  const submittedTxHash = await window.cardano.submitTx(
    Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
  );
  console.log(submittedTxHash);
}
