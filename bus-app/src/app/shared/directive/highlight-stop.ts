import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlightStop]',
  standalone: true
})
export class HighlightStopDirective implements OnChanges {
  @Input('appHighlightStop') shouldHighlight: boolean = false;

  @HostBinding('class.fw-bold') isBold = false;
  @HostBinding('class.text-primary') isColored = false;

  ngOnChanges() {
    this.isBold = this.shouldHighlight;
    this.isColored = this.shouldHighlight;
  }
}