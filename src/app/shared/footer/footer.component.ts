import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable} from 'rxjs';
import {SiteSettingsService} from '../../services/site-settings.service'; // Only if you use ngIf/ngFor etc. Not strictly needed for the example.

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule], // CommonModule might not be needed if template is simple
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
