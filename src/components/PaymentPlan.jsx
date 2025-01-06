import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Zap } from 'lucide-react'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'

import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Alert, AlertDescription } from './ui/alert'

const plans = [
  {
    name: 'Basic Plan',
    price: { monthly: 499, yearly: 4990 },
    description: 'Perfect for getting started',
    features: [
      '5 units of fuel',
      '24/7 support',
      'Basic features',
      '24 transactions per month',
      '16 altcoin pairs',
      '32 api connected at the same time maximum',
      'Basic AI analysis of markets'
    ]
  },
  {
    name: 'Pro Plan',
    price: { monthly: 999, yearly: 9990 },
    description: 'Most popular choice',
    features: [
      '12 units of fuel',
      'Priority support',
      'Advanced features',
      'Unlimited transactions per month',
      'Unlimited altcoin pairs',
      'Unlimited api connected at the same time',
      'Advanced AI analysis of markets',
      'Arbitra wallet'
    ],
    popular: true
  },
  {
    name: 'Premium Plan',
    price: { monthly: 1999, yearly: 19990 },
    description: 'For power users',
    features: [
      '25 units of fuel',
      'Premium support',
      'All features included',
      'Unlimited users accounts',
      'Advanced AI analysis of markets with experts insights',
      'Arbitra PRO wallet',
      'High priority customer support available 24h/7'
    ],
    enterprise: true
  }
]

export default function RazorpayPricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeRazorpay = async (plan) => {
    if (!isSignedIn) {
      setError('Please log in before making a purchase.')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Create order
      const response = await fetch('https://server.datasenseai.com/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: isYearly ? plan.price.yearly * 100 : plan.price.monthly * 100,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          notes: {
            planId: plan.name,
            fuelUnits: plan.features[0].split(' ')[0]
          }
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')
      
      const order = await response.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Datasense LMS',
        description: `${plan.name} - ${isYearly ? 'Yearly' : 'Monthly'}`,
        order_id: order.id,
        handler: async function(response) {
          try {
            const verifyResponse = await fetch('https://server.datasenseai.com/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                clerkId: user.id
              }),
            })

            if (!verifyResponse.ok) throw new Error('Payment verification failed')
            
            window.location.href = 'https://server.datasenseai.com/payment/payment-success'
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
        },
        theme: {
          color: '#10B981',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
      {isLoaded && (
        <div className="absolute top-4 right-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/go-premium" />
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl="/go-premium">
              <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Smart tech with smart pricing.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Unlock the power of data with our flexible pricing options. Save up to 20% with our yearly plans!
          </motion.p>
          
          <div className="flex items-center justify-center mt-8 gap-3">
            <span className={`${!isYearly ? 'text-emerald-400' : 'text-gray-400'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className={`${isYearly ? 'text-emerald-400' : 'text-gray-400'}`}>
              Yearly
              <span className="ml-2 inline-block bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">
                Save 20%!
              </span>
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 mx-auto max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ease-in-out transform ${
                hoveredPlan === plan.name
                  ? 'scale-105 shadow-2xl bg-gradient-to-br from-teal-900/70 to-teal-800/50 border border-teal-500/30 -translate-y-4'
                  : plan.popular
                  ? 'bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-500/20'
                  : 'bg-gray-800/50 border border-gray-700/30'
              } hover:cursor-pointer`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-sm px-3 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              <h3 className={`text-xl font-semibold mb-2 ${
                hoveredPlan === plan.name ? 'text-teal-300' : ''
              }`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${
                hoveredPlan === plan.name ? 'text-teal-200' : 'text-gray-400'
              }`}>{plan.description}</p>
              <div className="mb-6">
                <span className={`text-5xl font-bold ${
                  hoveredPlan === plan.name ? 'text-teal-200' : ''
                }`}>₹{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className={`ml-2 ${
                  hoveredPlan === plan.name ? 'text-teal-300' : 'text-gray-400'
                }`}>/{isYearly ? 'YR' : 'MO'}</span>
              </div>
              <Button
                className={`w-full mb-8 ${
                  hoveredPlan === plan.name
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : plan.enterprise
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => initializeRazorpay(plan)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    {plan.enterprise ? 'Contact Sales' : 'Get Started'}
                  </>
                )}
              </Button>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className={`flex items-start gap-3 text-sm ${
                      hoveredPlan === plan.name ? 'text-teal-100' : 'text-gray-300'
                    }`}
                  >
                    <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                      hoveredPlan === plan.name ? 'text-teal-400' : 'text-emerald-500'
                    }`} />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

