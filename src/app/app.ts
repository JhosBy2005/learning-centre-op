import {Component} from '@angular/core';
import {Layout} from './shared/presentation/components/layout/layout';

/**
 * Root component of the UrbanFit Sports Center Management Platform.
 *
 * @author José Santana
 */
@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
