'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useUser } from '@clerk/clerk-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Alert, AlertDescription } from "./ui/alert"

export function UserDetailModal({ open, onOpenChange, onClose }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const [formData, setFormData] = useState({
    clerkId: '',
    name: '',
    email: '',
    phone: '',
    instituteOrCompany: '',
    city: '',
    state: '',
    dob: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setFormData(prevData => ({
        ...prevData,
        clerkId: user.id,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      }))
    }
  }, [isLoaded, isSignedIn, user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('https://server.datasenseai.com/user-details/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        localStorage.setItem('userRegistered', 'true')
        onClose(true)
      } else {
        const errorData = await response.json()
        if (response.status === 409) {
          setError('This email is already registered. Please use a different email.')
        } else {
          setError(errorData.message || 'Failed to save user details. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error saving user details:', error)
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900 mb-2">
            Unlock Your Full Experience
          </DialogTitle>
          <p className="text-center text-gray-600">
            Just a few more details and you're all set to explore!
          </p>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instituteOrCompany" className="text-sm font-medium text-gray-700">Institute/Company</Label>
              <Input
                id="instituteOrCompany"
                name="instituteOrCompany"
                value={formData.instituteOrCompany}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border-t-0 border-x-0 border-b-2 border-gray-300 focus:border-blue-500 px-3 rounded-t-md"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Complete Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

