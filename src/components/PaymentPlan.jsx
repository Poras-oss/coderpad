import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 49900, // in paise
    fuel: 5,
    description: 'Perfect for getting started',
    features: ['5 units of fuel', '24/7 support', 'Basic features'],
    color: 'bg-blue-500'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99900, // in paise
    fuel: 12,
    description: 'Most popular choice',
    features: ['12 units of fuel', 'Priority support', 'Advanced features'],
    color: 'bg-purple-500',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 199900, // in paise
    fuel: 25,
    description: 'For power users',
    features: ['25 units of fuel', 'Premium support', 'All features included'],
    color: 'bg-green-500'
  }
];

const RazorpayPaymentPlans = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeRazorpay = async (plan) => {
    try {
      setLoading(true);
      setError('');

      // Create order
      const response = await fetch('https://server.datasenseai.com/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.price,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          clerkId: user.id, // Move clerkId to the top level
          notes: {
            planId: plan.id,
            fuelUnits: plan.fuel
          }
        }),
      });
      

      if (!response.ok) throw new Error('Failed to create order');
      
      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Datasense LMS',
        description: `${plan.name} - ${plan.fuel} Fuel Units`,
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
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');
            
            // Show success message or redirect
            window.location.href = 'https://server.datasenseai.com/payment/payment-success';
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
        },
        theme: {
          color: '#6366F1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Perfect Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Unlock the power of data with our flexible pricing options
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-8 mx-auto max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col justify-between ${plan.popular ? 'ring-2 ring-indigo-500' : ''}`}>
              <div>
                <CardHeader className={`${plan.color} text-white rounded-t-lg`}>
                  <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge className="absolute top-0 right-0 mt-4 mr-4 bg-yellow-400 text-yellow-900">
                      Most Popular
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">₹{(plan.price / 100).toFixed(2)}</span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </div>
                  <p className="mt-4 text-lg text-gray-500">{plan.description}</p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 ${plan.color} rounded-full p-1`}>
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardFooter className="mt-8">
                <Button 
                  className={`w-full ${plan.color} hover:opacity-90 transition-opacity duration-200`}
                  onClick={() => initializeRazorpay(plan)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Pay with Razorpay
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RazorpayPaymentPlans;

