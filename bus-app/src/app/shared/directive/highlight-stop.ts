import { Directive, ElementRef, HostBinding, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightStop]'
})
export class HighlightStopDirective {
  @Input('appHighlightStop') stopId!: string;
  @Input() searchedStopId!: string | null;

  @HostBinding('class.fw-bold') isBold = false;

  ngOnChanges() {
    this.isBold = !!this.searchedStopId && this.stopId === this.searchedStopId;
  }
}