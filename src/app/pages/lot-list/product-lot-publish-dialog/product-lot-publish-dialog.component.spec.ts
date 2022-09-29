import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLotPublishDialogComponent } from './product-lot-publish-dialog.component';

describe('ProductLotPublishDialogComponent', () => {
  let component: ProductLotPublishDialogComponent;
  let fixture: ComponentFixture<ProductLotPublishDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLotPublishDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLotPublishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
