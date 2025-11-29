import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  standalone: false,
})
export class AppButtonComponent {
  @Input() label = 'Enviar';
  @Input() color: string | undefined;
  @Input() expand: 'full' | 'block' | undefined = 'block';
  @Input() fill: 'clear' | 'outline' | 'solid' | 'default' | undefined;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' = 'button';

  @Output() pressed = new EventEmitter<Event>();

  onClick(ev: Event) {
    if (this.disabled || this.loading) return;
    this.pressed.emit(ev);
  }
}
