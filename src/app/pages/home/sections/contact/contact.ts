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

  protected readonly submitStatus = signal<'idle' | 'success' | 'error'>('idle');

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.contactModel.consent || !this.contactModel.name || !this.contactModel.email) {
      this.submitStatus.set('error');
      return;
    }
    // Simulate contact form submission
    this.submitStatus.set('success');
    
    // Clear form after delay
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
