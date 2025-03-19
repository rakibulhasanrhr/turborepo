import React from 'react'
import User from '../user/components/user'

const page = () => {
    return (
        <div className='p-3.5'>
            <h1 className='text-3xl text-center pb-6'>User Management</h1>
            <User></User>
        </div>
    )
}

export default page