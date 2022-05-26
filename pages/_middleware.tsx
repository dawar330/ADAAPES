import { NextRequest, NextResponse } from 'next/server';
import { useEffect } from "react";


export async function middleware(req: NextRequest) {

   
    const header = req.headers.get("authorization");

    if (typeof window !== "undefined") {

        let data_ = localStorage.getItem('user');
        // console.log("authorizaion heade2r:....", data_);

    }
    // console.log("authorizaion header:....", header);

    return NextResponse.next();
}