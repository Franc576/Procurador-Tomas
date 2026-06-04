import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html'
})
export class Contact {
  protected readonly contactModel = {
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  };

  protected readonly submitStatus = signal<'idle' | 'success' | 'error' | 'sending'>('idle');

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.contactModel.consent || !this.contactModel.name || !this.contactModel.email || !this.contactModel.message) {
      this.submitStatus.set('error');
      return;
    }

    this.submitStatus.set('sending');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.contactModel)
      });

      if (response.ok) {
        this.submitStatus.set('success');
        this.resetForm();
      } else {
        this.submitStatus.set('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      this.submitStatus.set('error');
    }
  }

  private resetForm(): void {
    setTimeout(() => {
      this.contactModel.name = '';
      this.contactModel.email = '';
      this.contactModel.subject = '';
      this.contactModel.message = '';
      this.contactModel.consent = false;
      this.submitStatus.set('idle');
    }, 3000);
  }
}
