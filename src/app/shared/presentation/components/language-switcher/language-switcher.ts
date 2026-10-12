import {Component, inject} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

/**
 * Allows the user to switch the language of the interface.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);

  /**
   * Languages supported by the application.
   */
  protected readonly languages = ['en', 'es'];

  /**
   * Current language of the interface.
   */
  protected currentLanguage = this.translate.getCurrentLang() ?? 'en';

  /**
   * Changes the language of the interface.
   * @param language - Selected language.
   */
  protected useLanguage(language: string): void {
    this.currentLanguage = language;
    this.translate.use(language);
  }
}
