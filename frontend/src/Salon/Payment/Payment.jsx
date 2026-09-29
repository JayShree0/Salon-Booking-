import { Card, Divider } from '@mui/material'
import React from 'react'

const Payment = () => {
  return (
    <div className=''>

      <Card className="rounded-md space-y-4  p-5">
        <h1 className='text-gray-600 font-medium'>Total Earning</h1>
        <h1 className='font-bold text-xl pb-1'>3999</h1>
        <Divider/>
        <p>Last Payment : <strong>$399</strong></p>
      </Card>
    </div>
  )
}

export default Payment