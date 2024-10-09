import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsDisplayComponent } from './comments-display.component';

describe('CommentsDisplayComponent', () => {
  let component: CommentsDisplayComponent;
  let fixture: ComponentFixture<CommentsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
