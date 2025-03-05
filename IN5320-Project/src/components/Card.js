import classes from './Card.module.css';
import React from "react";
import { IconCross24, Modal, ModalTitle, ModalContent } from '@dhis2/ui';

export function Card({ children, hide, title, onClose, newInspection }) {
    return (
        <Modal fluid hide={hide} className={`${classes.card} ${newInspection ? classes.newInspection : ''}`}>
            <button
                aria-label={"Close form"}
                tabIndex={0}
                onClick={() => onClose()}
                className={classes.closeButton}
            >
                <IconCross24/>
            </button>
            <ModalTitle
            >
                {title}
            </ModalTitle>
            <ModalContent className={classes.cardContent}>
                {children}
            </ModalContent>
        </Modal>
    );
}