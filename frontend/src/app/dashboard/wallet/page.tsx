'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Plus, History, ArrowUp, ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        api.getWalletBalance(),
        api.getWalletTransactions(),
      ])
      setBalance(balanceData.balance)
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Failed to load wallet data:', error)
      // Use mock data if API fails
      setBalance(200)
      setTransactions([
        {
          id: '1',
          type: 'CREDIT',
          amount: 100,
          description: 'Referral bonus',
          date: '2024-01-10',
        },
        {
          id: '2',
          type: 'DEBIT',
          amount: 50,
          description: 'Course purchase',
          date: '2024-01-08',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹{balance}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Available for course purchases
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-primary" />
                Add Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="h-16 text-lg font-semibold"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 border rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          txn.type === 'CREDIT'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {txn.type === 'CREDIT' ? (
                          <ArrowDown className="h-5 w-5" />
                        ) : (
                          <ArrowUp className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(txn.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
