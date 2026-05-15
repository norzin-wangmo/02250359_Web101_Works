"use client";

import Modal from "../ui/Modal";
import AuthForms from "./AuthForms";

export default function AuthModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForms onClose={onClose} />
    </Modal>
  );
}