import { Card, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../../config/api'

const Payment = () => {
  const [report, setReport] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([api.get("/api/bookings/report"), api.get("/api/payments/salon")])
      .then(([reportResponse, paymentResponse]) => {
        setReport(reportResponse.data)
        setPayments(paymentResponse.data || [])
      })
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Payments</h1>
      {loading && <p>Loading payment summary...</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!loading && !error && <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-4 p-5">
          <h2 className="text-gray-600 font-medium">Total earnings</h2>
          <p className="font-bold text-2xl">₹{report?.totalEarnings ?? 0}</p>
          <Divider />
          <p>{report?.totalBookings ?? 0} bookings · ₹{report?.totalRefunds ?? 0} refunds</p>
        </Card>
        <Card className="space-y-4 p-5">
          <h2 className="text-gray-600 font-medium">Payment orders</h2>
          <p className="font-bold text-2xl">{payments.length}</p>
          <Divider />
          <p>{payments.filter((payment) => payment.status === "SUCCESS").length} successful payments</p>
        </Card>
      </div>}
    </div>
  )
}

export default Payment