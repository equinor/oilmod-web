
import { inject, Injectable, OnDestroy, DOCUMENT } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import {
  ThemeModel,
  ThemeName,
  themes,
  typography,
  TypographyName,
} from './models';
import { iconMap } from './svg-icons';
import {
  THEME_SAVER,
  ThemeSaver,
  ThemeSaverService,
} from './theme-saver.service';

@Injectable({
  providedIn: 'root',
})
export class StoThemeService implements OnDestroy {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private readonly saver = inject<ThemeSaver<Observable<ThemeModel>>>(
    THEME_SAVER,
    { optional: true },
  );

  private themeSubject$ = new BehaviorSubject<ThemeName>('light');
  private typographySubject$ = new BehaviorSubject<TypographyName>('medium');
  private previousTheme: ThemeName;
  private previousTypography: TypographyName;
  private destroyed$ = new Subject<boolean>();
  private themeObserver: MutationObserver;
  private typographyObserver: MutationObserver;
  private readonly document: Document;

  constructor() {
    const document = inject<Document>(DOCUMENT);

    if (!this.saver) {
      this.saver = new ThemeSaverService();
    }
    this.document = document as Document;
    this.listenForBodyClassChangesToTheme();
    this.listenForBodyClassChangesToTypography();
    this.setThemeClass();
    this.setTypographyClass();
    this.getInitialValuesFromStorage();
    this.document.body.classList.add('mat-app-background');
    this.iconRegistry.setDefaultFontSetClass('material-icons-outlined');
    const icon = this.sanitizer.bypassSecurityTrustHtml(
      iconMap.get('equinor') as string,
    ) as string;
    this.iconRegistry.addSvgIconLiteral('equinor', icon);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.themeObserver.disconnect();
    this.typographyObserver.disconnect();
  }

  setTheme(theme: ThemeName) {
    if (!theme || !themes.has(theme)) {
      const preferDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = preferDark ? 'dark' : 'light';
    }
    this.themeSubject$.next(theme);
    return this.saver?.save({ type: 'theme', value: theme });
  }

  setTypography(variant: TypographyName) {
    if (!variant || !typography.has(variant)) {
      variant = 'medium';
    }
    this.typographySubject$.next(variant);
    return this.saver?.save({ type: 'typography', value: variant });
  }

  getActiveTheme() {
    return this.themeSubject$.asObservable().pipe(
      map((val) => ({
        name: val,
        className: themes.get(val),
      })),
    );
  }

  getActiveTypography() {
    return this.typographySubject$.asObservable().pipe(
      map((val) => ({
        name: val,
        className: typography.get(val),
      })),
    );
  }

  private listenForBodyClassChangesToTheme() {
    const body = this.document.body;
    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        const t = m.target as HTMLBodyElement;
        const darkmode = t.classList.contains('sto-dark-theme');
        const themeName = darkmode ? 'dark' : 'light';
        if (this.previousTheme === themeName) {
          return;
        }
        this.previousTheme = themeName;
        if (darkmode) {
          this.setTheme('dark');
        } else {
          this.setTheme('light');
        }
      });
    });
    this.themeObserver.observe(body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });
  }

  private setThemeClass() {
    this.getActiveTheme()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((theme) => {
        this.document.body.classList.remove(
          'sto-dark-theme',
          'sto-light-theme',
        );
        this.document.body.classList.add(themes.get(theme.name) ?? '');
      });
  }

  private listenForBodyClassChangesToTypography() {
    const body = this.document.body;
    this.typographyObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        const t = m.target as HTMLBodyElement;
        const small = t.classList.contains(typography.get('small') ?? '');
        const large = t.classList.contains(typography.get('large') ?? '');
        const typographyName: TypographyName = small
          ? 'small'
          : large
            ? 'large'
            : 'medium';
        if (this.previousTypography === typographyName) {
          return;
        }
        this.previousTypography = typographyName;
        this.setTypography(typographyName);
      });
    });
    this.typographyObserver.observe(body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });
  }

  private setTypographyClass() {
    this.getActiveTypography()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((typo) => {
        this.document.body.classList.remove(...typography.values());
        this.document.body.classList.add(typo.className ?? '');
      });
  }

  private async getInitialValuesFromStorage() {
    if (!this.saver) return;
    try {
      const theme = await firstValueFrom(
        this.saver.load('theme').pipe(take(1)),
      );
      this.setTheme(theme.value as ThemeName);
      const typo = await firstValueFrom(
        this.saver.load('typography').pipe(take(1)),
      );
      this.setTypography(typo.value as TypographyName);
    } catch {
      // gotta catch em all
    }
  }
}
