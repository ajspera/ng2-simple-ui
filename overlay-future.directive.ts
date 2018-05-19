// Overlay mimicing function of *ngIf structural directive.
// Will require @Output compatability with structural directives which is a backlogged feature

import {
  Directive,
  Input,
  Output,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { NgIfContext } from '@angular/common';

@Directive({
  selector: '[appOverlay]'
})
export class OverlayDirective {
  private _context: NgIfContext = new NgIfContext();
  private _thenTemplateRef: TemplateRef<NgIfContext>|null = null;
  private _thenViewRef: EmbeddedViewRef<NgIfContext>|null = null;
  private _overLayEl: Element;

  constructor(private _viewContainer: ViewContainerRef, private elementRef: ElementRef, templateRef: TemplateRef<NgIfContext>) {
    this._thenTemplateRef = templateRef;
  }
  @Output() closeAction: EventEmitter<boolean> = new EventEmitter();
  @Input()
  set appOverlay(condition: any) {
    this._context.$implicit = this._context.ngIf = condition;
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        if (this._thenTemplateRef) {
          this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
          this._overLayEl = this._thenViewRef.rootNodes[0];
          this._overLayEl.classList.add('overlay');
          this._thenViewRef.rootNodes[0].onclick = (e) => {
            if(e.target === this._overLayEl){
              this.closeAction.emit(null);
            }
          }
        }
      }
    } else {
      this._viewContainer.clear();
      this._thenViewRef = null;
      this._overLayEl = null;
    }
  }
}
