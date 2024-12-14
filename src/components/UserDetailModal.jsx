'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useUser } from '@clerk/clerk-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useToast } from "./ui/use-toast"
import { Card, CardContent } from "./ui/card"
import { UserCircle } from 'lucide-react'

export function UserDetailModal({ open, onOpenChange, onClose }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const { toast } = useToast()
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
        
        toast({
          title: "Success",
          description: "User details saved successfully",
        })
        onClose(true)
      } else {
        throw new Error('Failed to save user details')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user details",
        variant: "destructive",
      })
      onClose(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
            Before moving forward, please complete your profile. It won't take long!
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-lg">
          <CardContent>
            <div className="flex justify-center mb-6">
              <UserCircle className="w-20 h-20 text-blue-500" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right font-semibold">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right font-semibold">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instituteOrCompany" className="text-right font-semibold">
                    Institute/Company
                  </Label>
                  <Input
                    id="instituteOrCompany"
                    name="instituteOrCompany"
                    value={formData.instituteOrCompany}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right font-semibold">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="state" className="text-right font-semibold">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dob" className="text-right font-semibold">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Save and Continue
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

