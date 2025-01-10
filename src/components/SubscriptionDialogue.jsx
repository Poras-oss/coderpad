import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertCircle, AlertTriangle } from 'lucide-react';

const SubscriptionDialogue = ({ isOpen, onClose, status }) => {
  const dialogContent = {
    'not_premium': {
      icon: <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />,
      title: "Premium Access Required",
      description: "This feature is only available to premium users. Upgrade your account to access exclusive content and features.",
      actionText: "Upgrade Now"
    },
    'expired': {
      icon: <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />,
      title: "Subscription Expired",
      description: "Your premium subscription has expired. Renew now to continue enjoying premium features.",
      actionText: "Renew Subscription"
    }
  };

  const content = dialogContent[status] || dialogContent['not_premium'];

  const handleAction = () => {
    // Navigate to upgrade/renewal page
    window.location.href = '/go-premium';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {content.icon}
            <DialogTitle className="text-xl font-semibold">{content.title}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="text-center">
          {content.description}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleAction} className="w-full">
            {content.actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialogue;
