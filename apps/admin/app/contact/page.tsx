import ContactsTable from '@/components/table/table'
import React from 'react'

const page = () => {
    return (

        <ContactsTable apiEndpoint='http://localhost:3024/user' />
    )
}

export default page