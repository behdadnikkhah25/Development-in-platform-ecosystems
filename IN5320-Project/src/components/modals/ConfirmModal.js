import React from 'react';

import { Button, IconCross24, IconCheckmark24 } from '@dhis2/ui';
import {Card} from "../Card";
export function ConfirmModal({ onClose, onConfirm, title }) {


    return (
        <Card onClose={onClose} title={title}>
            <div className={"confirmModalButtons"}>
                <Button
                    icon={<IconCross24/>}
                    onClick={onClose}
                    destructive secondary
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    primary
                    icon={
                    <IconCheckmark24/>
                    }
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </div>
        </Card>
    );

}