import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Import Router

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMobileNavOpen = false;

  constructor(private router: Router) {} // Inject Router

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    if (this.isMobileNavOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when mobile nav is open
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
    document.body.style.overflow = '';
  }

  navigateToLogin() {
    this.closeMobileNav(); // Close nav if open
    // this.router.navigate(['/login']); // Replace with your actual login route
    console.log('Navigate to login page');
  }
}
