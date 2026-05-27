'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import useGetMe from './hooks/useGetMe';

function Inituser() {
    const { status } = useSession()
    useGetMe(status == "authenticated")
    return null;
}

export default Inituser
