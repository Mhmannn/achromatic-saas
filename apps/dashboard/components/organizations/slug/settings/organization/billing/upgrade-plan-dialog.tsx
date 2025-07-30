'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';

import { PlanSelection } from '~/components/organizations/slug/settings/organization/billing/plan-selection';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export const UpgradePlanDialog = NiceModal.create(() => {
  const modal = useEnhancedModal();
  return (
    <Dialog open={modal.visible}>
      <DialogContent
        className="max-w-full flex flex-col h-full rounded-none!"
        onClose={modal.handleClose}
        onAnimationEndCapture={modal.handleAnimationEndCapture}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Upgrade your plan</DialogTitle>
          <DialogDescription className="sr-only">
            Select a plan below to upgrade.
          </DialogDescription>
        </DialogHeader>
        <PlanSelection title="Upgrade your plan" />
      </DialogContent>
    </Dialog>
  );
});
