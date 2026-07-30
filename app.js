(function () {
  const config = window.medianewsConfig || {};

  const savedCredentials = {
    basicAuth: {
      login: config.savedCredentials?.login || '',
      password: config.savedCredentials?.password || ''
    }
  };

  const domains = [
    'www2.obozrevatel.com',
    'cdn4.obozrevatel.com',
    'i4.obozrevatel.com',
    'news2.obozrevatel.com',
    'war2.obozrevatel.com',
    'soc2.obozrevatel.com',
    'incident2.obozrevatel.com',
    'hot2.obozrevatel.com',
    'healthnews2.obozrevatel.com',
    'finance2.obozrevatel.com',
    'competitions2.obozrevatel.com',
    'rest2.obozrevatel.com',
    'hub2.obozrevatel.com',
    'sport2.obozrevatel.com',
    'covid2.obozrevatel.com',
    'food2.obozrevatel.com',
    'shkola2.obozrevatel.com',
    'med2.obozrevatel.com',
    'life2.obozrevatel.com',
    'bewell2.obozrevatel.com',
    'realty2.obozrevatel.com',
    'admin-medianews.obozrevatel.com'
  ];

  const minimalDomains = [
    'www2.obozrevatel.com',
    'cdn4.obozrevatel.com',
    'i4.obozrevatel.com',
    'news2.obozrevatel.com',
    'war2.obozrevatel.com',
    'soc2.obozrevatel.com',
    'incident2.obozrevatel.com',
    'hot2.obozrevatel.com',
    'healthnews2.obozrevatel.com',
    'finance2.obozrevatel.com',
    'competitions2.obozrevatel.com',
    'sport2.obozrevatel.com',
    'food2.obozrevatel.com',
    'shkola2.obozrevatel.com'
  ];

  const minimalDomainSet = new Set(minimalDomains);

  const testPages = [
    { label: 'Розділ', url: 'https://www2.obozrevatel.com/ukr/ekonomika-glavnaya/' },
    { label: 'Підрозділ', url: 'https://www2.obozrevatel.com/ukr/ekonomika-glavnaya/analytics-and-forecasts/' },
    { label: 'Картина дня', url: 'https://www2.obozrevatel.com/ukr/main-item/06-11-2025.htm' },
    { label: 'Новина', url: 'https://www2.obozrevatel.com/ukr/puteshestviya/butskij-kanjon-malenka-shvejtsariya-u-cherkaskij-oblasti.htm' },
    { label: 'AMP новина', url: 'https://www2.obozrevatel.com/puteshestviya/butskij-kanon-malenkaya-shvejtsariya-v-cherkasskoj-oblasti/amp.htm' },
    { label: 'Новина-блог', url: 'https://www2.obozrevatel.com/ukr/politics-news/pomer-odin-z-batkiv-politichnogo-tsinizmu-chomu-ukraintsyam-ne-varto-osoblivo-vihvalyati-genri-kissindzhera.htm' },
    { label: 'AMP новина-блог', url: 'https://www2.obozrevatel.com/ukr/politics-news/pomer-odin-z-batkiv-politichnogo-tsinizmu-chomu-ukraintsyam-ne-varto-osoblivo-vihvalyati-genri-kissindzhera/amp.htm' },
    { label: 'Тег', url: 'https://www2.obozrevatel.com/ukr/tag-ukrainskij-yazyik.html' },
    { label: 'Місто', url: 'https://www2.obozrevatel.com/ukr/tag-kiev.html' },
    { label: 'Країна', url: 'https://www2.obozrevatel.com/ukr/tag-ukraina.html' },
    { label: 'Тема', url: 'https://www2.obozrevatel.com/ukr/topic-1-aprelya.html' },
    { label: 'Персона', url: 'https://www2.obozrevatel.com/ukr/person-astrooboz.html' },
    { label: 'Усі блоги', url: 'https://www2.obozrevatel.com/ukr/p-blog.html' },
    { label: 'Спецпроєкти', url: 'https://www2.obozrevatel.com/ukr/p-specialproject.html' },
    { label: 'Важливе', url: 'https://www2.obozrevatel.com/ukr/p-supertop.html' },
    { label: 'Топ публікації', url: 'https://www2.obozrevatel.com/ukr/p-toppublication.html' },
    { label: 'Про компанію', url: 'https://www2.obozrevatel.com/ukr/company/about.html' },
    { label: 'Команда', url: 'https://www2.obozrevatel.com/ukr/company/team.html' },
    { label: 'Сторінка пошуку', url: 'https://www2.obozrevatel.com/search/?q=%D0%BA%D0%B8%D1%97%D0%B2&lang=uk' },
    { label: '404 сторінка', url: 'https://www2.obozrevatel.com/ekonomika-glavdsadafdsfdfsdfadfsadfnaya/' },
    { label: 'Спецсторінки / лендінги', url: 'https://www2.obozrevatel.com/ukr/info-reklama.html' }
  ];

  const defaultPath = '/';
  const domainSettings = {
    'www2.obozrevatel.com': {
      authCycles: 4,
      revisitAfterBulkOpen: true
    },
    'war2.obozrevatel.com': {
      authCycles: 4,
      revisitAfterBulkOpen: true
    },
    'admin-medianews.obozrevatel.com': {
      displayPath: '/login',
      authPath: '/login',
      authCycles: 3
    }
  };

  const openDelayMs = 1200;
  const authStepDelayMs = 1600;
  const closeDelayMs = 16000;
  const popupWarmupCount = 3;

  let statusNode;
  let domainsListNode;
  let testPagesListNode;

  function createLayout() {
    document.title = config.pageTitle || 'Medianews';

    document.body.innerHTML = `
      <main class="page">
        <section class="hero">
          <div class="hero-badge">Medianews • ${escapeHtml(config.accountName || 'Редакція')}</div>
          <h1>${escapeHtml(config.pageHeading || 'Medianews')}</h1>
          <p>Сторінка допомагає швидко пройти Basic Auth на staging-доменах і відкрити тестові сторінки для перевірки.</p>
        </section>

        <div class="grid">
          <section class="card">
            <h2>Вхід</h2>
            <p class="muted">Логін і пароль уже підставлені. За потреби їх можна змінити вручну.</p>

            <div class="field">
              <label for="login">Логін</label>
              <input id="login" type="text" placeholder="Введіть логін" />
            </div>

            <div class="field">
              <label for="password">Пароль</label>
              <input id="password" type="password" placeholder="Введіть пароль" />
            </div>

            <div class="button-stack">
              <button id="allowPopupsButton" class="button-secondary">Дозволити попапи для цієї сторінки</button>
              <button id="minimalButton">Відкрити і закрити мінімальний набір з авторизацією</button>
              <button id="openAllCloseButton" class="button-soft">Відкрити все і закрити вкладки</button>
              <button id="openAllKeepButton" class="button-soft">Відкрити все і залишити вкладки відкритими</button>
            </div>

            <p id="status" class="status"></p>

            <div class="warning-box">
              Увага: логін і пароль збережені в цій сторінці та передаються в URL під час авторизації. Використовуйте це лише для внутрішнього staging-середовища.
            </div>
          </section>

          <section class="card">
            <h2>Як користуватись</h2>
            <ol class="instruction-list">
              <li>Натисніть <strong>«Дозволити попапи для цієї сторінки»</strong>.</li>
              <li>Якщо браузер показав запит на дозвіл попапів, натисніть <strong>Allow / Дозволити</strong>.</li>
              <li>Для швидкого сценарію використовуйте <strong>«Відкрити і закрити мінімальний набір з авторизацією»</strong>.</li>
              <li>Якщо потрібно прогріти всі домени, використовуйте одну з кнопок <strong>«Відкрити все...»</strong>.</li>
              <li>Після авторизації відкрийте кілька тестових сторінок нижче і перевірте, чи сайт не просить пароль повторно.</li>
            </ol>

            <ul class="tip-list">
              <li>Якщо відкрилась лише одна вкладка, зазвичай це означає, що браузер ще не дозволив попапи.</li>
              <li>Скріншоти з інструкцією по закриттю вкладки та видачі дозволів можна буде додати сюди окремо.</li>
              <li>Зелений кружечок біля домену означає, що він входить у мінімальний набір.</li>
            </ul>
          </section>
        </div>

        <div class="grid">
          <section class="card">
            <h2>Домени</h2>
            <div class="legend">
              <span class="minimal-dot"></span>
              <span>Входить у мінімальний набір</span>
            </div>
            <p class="section-note">Кнопка «Відкрити з авторизацією» відкриває один домен окремо, без додаткових перезавантажень.</p>
            <ul id="domainsList" class="domain-list"></ul>
          </section>

          <section class="card">
            <h2>Тестові сторінки</h2>
            <p class="section-note">Після прогріву авторизації відкрийте кілька сторінок із цього списку та перевірте, що вони відкриваються без повторного вводу пароля.</p>
            <ul id="testPagesList" class="test-page-list"></ul>
          </section>
        </div>
      </main>
    `;

    statusNode = document.getElementById('status');
    domainsListNode = document.getElementById('domainsList');
    testPagesListNode = document.getElementById('testPagesList');

    document.getElementById('allowPopupsButton').onclick = unlockBulkOpen;
    document.getElementById('minimalButton').onclick = openMinimalTabs;
    document.getElementById('openAllCloseButton').onclick = () => openAll(true);
    document.getElementById('openAllKeepButton').onclick = () => openAll(false);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function setStatus(message, isError = false) {
    statusNode.textContent = message;
    statusNode.className = isError ? 'status error' : 'status';
  }

  function fillSavedCredentials() {
    document.getElementById('login').value = savedCredentials.basicAuth.login || '';
    document.getElementById('password').value = savedCredentials.basicAuth.password || '';
  }

  function getCredentials() {
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;

    if (!login || !password) {
      alert('Введіть логін і пароль');
      return null;
    }

    return { login, password };
  }

  function getDomainSettings(domain) {
    return {
      displayPath: defaultPath,
      authPath: defaultPath,
      ...domainSettings[domain]
    };
  }

  function getAuthUrl(domain, credentials) {
    const settings = getDomainSettings(domain);
    const encodedLogin = encodeURIComponent(credentials.login);
    const encodedPassword = encodeURIComponent(credentials.password);

    return `https://${encodedLogin}:${encodedPassword}@${domain}${settings.authPath}`;
  }

  function getPlainUrl(domain) {
    const settings = getDomainSettings(domain);
    return `https://${domain}${settings.displayPath}`;
  }

  function getNavigationPlan(domain, credentials) {
    const settings = getDomainSettings(domain);
    const authUrl = getAuthUrl(domain, credentials);
    const plainUrl = getPlainUrl(domain);
    const authCycles = settings.authCycles || 2;
    const steps = [];

    for (let index = 0; index < authCycles; index += 1) {
      steps.push(authUrl, plainUrl);
    }

    return steps;
  }

  function runNavigationSequence(tab, domain, credentials, startDelayMs) {
    const steps = getNavigationPlan(domain, credentials);

    steps.forEach((url, stepIndex) => {
      setTimeout(() => {
        try {
          tab.location.replace(url);
        } catch (error) {
          console.warn(`Не вдалося відкрити домен: ${domain}`, error);
        }
      }, startDelayMs + stepIndex * authStepDelayMs);
    });

    return steps.length;
  }

  function getRevisitDomains() {
    return domains.filter(domain => getDomainSettings(domain).revisitAfterBulkOpen);
  }

  function openMinimalTabs() {
    openDomainGroup(minimalDomains, true, 'мінімальний набір');
  }

  function openSingle(domain) {
    const credentials = getCredentials();

    if (!credentials) {
      return;
    }

    const url = getAuthUrl(domain, credentials);
    const tab = window.open(url, '_blank');

    if (!tab) {
      setStatus('Браузер заблокував вкладку. Дозвольте попапи для цієї сторінки й спробуйте ще раз.', true);
    }
  }

  function openTestPage(url) {
    window.open(url, '_blank');
  }

  function unlockBulkOpen() {
    const warmupTabs = [];

    for (let index = 0; index < Math.min(domains.length, popupWarmupCount); index += 1) {
      const tab = window.open('about:blank', `stage-popup-warmup-${index}`);

      if (!tab) {
        setStatus(
          'Браузер усе ще блокує попапи. Натисніть іконку попапа в адресному рядку, дозвольте попапи для цієї сторінки й спробуйте ще раз.',
          true
        );
        return;
      }

      tab.document.write(`
        <!doctype html>
        <html lang="uk">
          <head>
            <meta charset="UTF-8" />
            <title>Перевірка попапів</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 16px;">
            <p>Перевірка доступу до попапів для Medianews...</p>
          </body>
        </html>
      `);
      tab.document.close();
      warmupTabs.push(tab);
    }

    setStatus('Схоже, доступ до попапів є. Якщо браузер показав запит, натисніть «Дозволити», а потім запускайте потрібний сценарій.');

    setTimeout(() => {
      warmupTabs.forEach(tab => {
        try {
          tab.close();
        } catch (error) {
          console.warn('Не вдалося закрити warm-up вкладку', error);
        }
      });
    }, 1500);
  }

  function openAll(shouldCloseTabs) {
    openDomainGroup(domains, shouldCloseTabs, 'усі вкладки');
  }

  function openDomainGroup(targetDomains, shouldCloseTabs, groupLabel) {
    const credentials = getCredentials();

    if (!credentials) {
      return;
    }

    const preparedTabs = targetDomains.map((domain, index) => {
      const tab = window.open('about:blank', `stage-auth-${index}`);

      if (!tab) {
        return { domain, blocked: true };
      }

      tab.document.write(`
        <!doctype html>
        <html lang="uk">
          <head>
            <meta charset="UTF-8" />
            <title>Авторизація: ${domain}</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 16px;">
            <p>Авторизація для <strong>${domain}</strong>...</p>
          </body>
        </html>
      `);
      tab.document.close();

      return { domain, tab, blocked: false };
    });

    const blockedDomains = preparedTabs
      .filter(item => item.blocked)
      .map(item => item.domain);
    const openedTabs = preparedTabs.filter(item => !item.blocked);

    if (!openedTabs.length) {
      setStatus('Браузер заблокував усі попапи. Дозвольте попапи для цієї сторінки й спробуйте ще раз.', true);
      return;
    }

    if (blockedDomains.length) {
      setStatus(`Відкрито ${openedTabs.length} із ${targetDomains.length} (${groupLabel}). Заблоковано браузером: ${blockedDomains.join(', ')}`, true);
    } else {
      setStatus(`Відкрито ${openedTabs.length} (${groupLabel}). Виконуємо кілька проходів авторизації для кожного домену.`);
    }

    openedTabs.forEach(({ domain, tab }, index) => {
      const startDelayMs = index * openDelayMs;
      const stepsCount = runNavigationSequence(tab, domain, credentials, startDelayMs);

      if (shouldCloseTabs) {
        setTimeout(() => {
          try {
            tab.close();
          } catch (error) {
            console.warn(`Не вдалося закрити вкладку: ${domain}`, error);
          }
        }, startDelayMs + stepsCount * authStepDelayMs + closeDelayMs);
      }
    });

    const revisitDomains = getRevisitDomains();
    const revisitStartDelayMs = openedTabs.length * openDelayMs + 4000;

    revisitDomains.forEach((domain, revisitIndex) => {
      const preparedTab = openedTabs.find(item => item.domain === domain);

      if (!preparedTab) {
        return;
      }

      runNavigationSequence(
        preparedTab.tab,
        domain,
        credentials,
        revisitStartDelayMs + revisitIndex * 2000
      );
    });
  }

  function renderDomains() {
    domains.forEach(domain => {
      const item = document.createElement('li');
      item.className = 'domain-row';

      const meta = document.createElement('div');
      meta.className = 'domain-meta';

      if (minimalDomainSet.has(domain)) {
        const dot = document.createElement('span');
        dot.className = 'minimal-dot';
        dot.title = 'Входить у мінімальний набір';
        meta.appendChild(dot);
      }

      const link = document.createElement('a');
      link.href = getPlainUrl(domain);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = getPlainUrl(domain);
      link.className = 'domain-link';

      meta.appendChild(link);

      const button = document.createElement('button');
      button.textContent = 'Відкрити з авторизацією';
      button.className = 'small-button button-soft';
      button.onclick = () => openSingle(domain);

      item.appendChild(meta);
      item.appendChild(button);
      domainsListNode.appendChild(item);
    });
  }

  function renderTestPages() {
    testPages.forEach(page => {
      const item = document.createElement('li');
      item.className = 'test-page-row';

      const meta = document.createElement('div');
      meta.className = 'test-page-meta';

      const label = document.createElement('div');
      label.className = 'test-label';
      label.textContent = page.label;

      const link = document.createElement('a');
      link.href = page.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = page.url;
      link.className = 'test-page-link';

      meta.appendChild(label);
      meta.appendChild(link);

      const button = document.createElement('button');
      button.textContent = 'Відкрити';
      button.className = 'small-button button-secondary';
      button.onclick = () => openTestPage(page.url);

      item.appendChild(meta);
      item.appendChild(button);
      testPagesListNode.appendChild(item);
    });
  }

  createLayout();
  fillSavedCredentials();
  renderDomains();
  renderTestPages();
})();
