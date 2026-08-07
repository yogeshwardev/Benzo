'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, Download, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const data = await api.getCertificates()
      setCertificates(data)
    } catch (error) {
      console.error('Failed to load certificates:', error)
      // Use mock data if API fails
      setCertificates([
        {
          id: '1',
          courseName: 'Python for Data Science',
          issueDate: '2024-01-10',
          certificateUrl: '/certificates/python-data-science.pdf',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificateId: string) => {
    try {
      const blob = await api.downloadCertificate(certificateId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'certificate.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download certificate:', error)
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
        <h1 className="text-3xl font-bold mb-6">My Certificates</h1>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete a course to earn your certificate
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center">{cert.courseName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(cert.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
