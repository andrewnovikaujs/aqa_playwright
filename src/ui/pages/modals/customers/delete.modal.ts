import { expect } from "@playwright/test";
import { Modal } from "ui/pages/modals/modal.page";

export class DeleteCustomerModal extends Modal {
  readonly modalContainer = this.page.locator(`div[role="dialog"]`);
  readonly deleteButton = this.modalContainer.getByRole("button", { name: "Yes, Delete" });
  readonly cancelButton = this.modalContainer.getByRole("button", { name: "Cancel" });
  readonly title = this.modalContainer.locator(".modal-title");
  readonly closeButton = this.modalContainer.locator('button[aria-label="Close"]');

  uniqueElement = this.deleteButton;

  async close() {
    await this.closeButton.click();
    await this.waitForClosed();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}
