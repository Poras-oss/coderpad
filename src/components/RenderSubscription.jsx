"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/react-popover"
import { Crown, AlertCircle, CheckCircle2, X, Star } from "lucide-react"

const RenderSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)

  useEffect(() => {
    const getSubscriptionStatus = () => {
      const storedStatus = localStorage.getItem("subscriptionStatus")
      if (storedStatus) {
        setSubscriptionStatus(JSON.parse(storedStatus))
      }
    }

    getSubscriptionStatus()
    window.addEventListener("storage", getSubscriptionStatus)

    return () => {
      window.removeEventListener("storage", getSubscriptionStatus)
    }
  }, [])

  if (!subscriptionStatus) return null

  const getStatusDetails = () => {
    switch (subscriptionStatus.message) {
      case "User not subscribed":
        return {
          icon: <Star className="h-5 w-5 text-yellow-500" />,
          buttonIcon: <Crown className="h-4 w-4 text-yellow-500" />,
          label: "Free Plan",
          color: "yellow",
          action: "Upgrade to Premium",
          description: "Unlock all premium features",
          gradient: "from-yellow-50 to-yellow-100",
        }
      case "Subscription Expired":
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          buttonIcon: <AlertCircle className="h-4 w-4 text-red-500" />,
          label: "Expired",
          color: "red",
          action: "Reactivate Premium",
          description: "Your premium access has expired",
          gradient: "from-red-50 to-red-100",
        }
      case "Subscription is active":
        const expiryDate = new Date(subscriptionStatus.subscriptionExpiry)
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          buttonIcon: <Crown className="h-4 w-4 text-green-500" />,
          label: "Premium",
          color: "green",
          description: `Premium membership`,
          expiryDate: expiryDate,
          gradient: "from-green-50 to-green-100",
          fuel: subscriptionStatus.fuel,
        }
      default:
        return null
    }
  }

  const statusDetails = getStatusDetails()
  if (!statusDetails) return null

  // Calculate fuel percentage for the progress bar
  const fuelPercentage = statusDetails.fuel ? Math.min(Math.max((statusDetails.fuel / 200) * 100, 0), 100) : 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-2 hover:scale-105 transition-transform duration-200 ease-in-out shadow-sm hover:shadow-md"
        >
          {statusDetails.buttonIcon}
          <span className="sr-only">Subscription Status</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-xl rounded-lg overflow-hidden">
        <div className={`p-4 bg-gradient-to-br ${statusDetails.gradient} rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Membership Status</h4>
            <Badge
              variant={
                statusDetails.color === "yellow" ? "warning" : statusDetails.color === "red" ? "destructive" : "success"
              }
              className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
            >
              {statusDetails.label}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            {statusDetails.icon}
            <h5 className="text-sm text-gray-600">{statusDetails.description}</h5>
          </div>

          {statusDetails.expiryDate && (
            <div className="bg-green-50 border border-green-100 rounded-md p-3">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Valid Until:</span>
                  <span className="text-sm font-bold text-green-600">
                    {statusDetails.expiryDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Start Date:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(subscriptionStatus.subscriptionStart).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {statusDetails.fuel !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Fuel Balance</span>
                <span className="text-sm font-semibold text-indigo-600">{statusDetails.fuel.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                  style={{ width: `${fuelPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">Available fuel for premium features</p>
            </div>
          )}

          {statusDetails.action && (
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              {statusDetails.action}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default RenderSubscription

