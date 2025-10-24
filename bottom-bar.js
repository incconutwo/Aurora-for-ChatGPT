// bottom-bar.js - Reusable Bottom Bar Component

const BottomBar = (() => {
  const createBottomBar = (config = {}) => {
    const {
      leftButtons = [],
      centerContent = null,
      rightButtons = [],
      progressSteps = null,
      menuItems = [],
      onAction = () => {},
      className = ''
    } = config;

    const container = document.createElement('div');
    container.className = `bottom-bar ${className}`.trim();
    container.setAttribute('role', 'toolbar');
    container.setAttribute('aria-label', 'Bottom action bar');

    const leftSection = document.createElement('div');
    leftSection.className = 'bottom-bar-left';

    const centerSection = document.createElement('div');
    centerSection.className = 'bottom-bar-center';

    const rightSection = document.createElement('div');
    rightSection.className = 'bottom-bar-right';

    leftButtons.forEach(btn => leftSection.appendChild(createButton(btn, onAction)));
    
    if (centerContent) {
      if (centerContent instanceof HTMLElement) {
        centerSection.appendChild(centerContent);
      } else if (typeof centerContent === 'string') {
        centerSection.innerHTML = centerContent;
      }
    }

    if (progressSteps) {
      centerSection.appendChild(createProgressIndicator(progressSteps));
    }

    rightButtons.forEach(btn => rightSection.appendChild(createButton(btn, onAction)));

    if (menuItems.length > 0) {
      rightSection.appendChild(createMenu(menuItems, onAction));
    }

    container.appendChild(leftSection);
    container.appendChild(centerSection);
    container.appendChild(rightSection);

    return container;
  };

  const createButton = (config, onAction) => {
    const {
      id,
      label,
      icon,
      type = 'default',
      action,
      ariaLabel,
      tooltip,
      hidden = false,
      disabled = false,
      keyboardShortcut = null
    } = config;

    const button = document.createElement('button');
    button.className = `bottom-bar-btn ${type}`;
    button.setAttribute('type', 'button');
    
    if (id) button.id = id;
    if (ariaLabel || label) button.setAttribute('aria-label', ariaLabel || label);
    if (disabled) button.setAttribute('disabled', 'disabled');
    if (hidden) button.style.display = 'none';

    if (icon) {
      button.innerHTML = icon;
    }

    if (label) {
      const labelSpan = document.createElement('span');
      labelSpan.className = 'btn-label';
      labelSpan.textContent = label;
      button.appendChild(labelSpan);
    }

    if (tooltip) {
      const tooltipEl = document.createElement('span');
      tooltipEl.className = 'bottom-bar-tooltip';
      tooltipEl.textContent = tooltip;
      button.appendChild(tooltipEl);
    }

    if (keyboardShortcut) {
      const kbd = document.createElement('span');
      kbd.className = 'bottom-bar-kbd-hint';
      kbd.textContent = keyboardShortcut;
      button.appendChild(kbd);
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!disabled) {
        if (action) onAction(action, e);
      }
    });

    return button;
  };

  const createProgressIndicator = (config) => {
    const { current = 0, total = 3 } = config;
    
    const container = document.createElement('div');
    container.className = 'bottom-bar-progress';
    container.setAttribute('role', 'progressbar');
    container.setAttribute('aria-valuenow', current);
    container.setAttribute('aria-valuemin', '0');
    container.setAttribute('aria-valuemax', total);

    for (let i = 0; i < total; i++) {
      const step = document.createElement('div');
      step.className = 'progress-step';
      
      if (i < current) {
        step.classList.add('completed');
      } else if (i === current) {
        step.classList.add('active');
      }

      container.appendChild(step);
    }

    return container;
  };

  const createMenu = (items, onAction) => {
    const menuContainer = document.createElement('div');
    menuContainer.className = 'bottom-bar-menu';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'bottom-bar-menu-btn';
    menuBtn.setAttribute('type', 'button');
    menuBtn.setAttribute('aria-label', 'More options');
    menuBtn.setAttribute('aria-haspopup', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;

    const menuContent = document.createElement('div');
    menuContent.className = 'bottom-bar-menu-content';
    menuContent.setAttribute('role', 'menu');

    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'bottom-bar-menu-item';
      menuItem.setAttribute('role', 'menuitem');
      menuItem.setAttribute('tabindex', '0');

      if (item.icon) {
        menuItem.innerHTML = item.icon;
      }

      const labelSpan = document.createElement('span');
      labelSpan.textContent = item.label;
      menuItem.appendChild(labelSpan);

      if (item.keyboardShortcut) {
        const kbd = document.createElement('span');
        kbd.className = 'bottom-bar-kbd-hint';
        kbd.textContent = item.keyboardShortcut;
        menuItem.appendChild(kbd);
      }

      menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.action) onAction(item.action, e);
        menuContent.classList.remove('visible');
        menuBtn.setAttribute('aria-expanded', 'false');
      });

      menuItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menuItem.click();
        }
      });

      menuContent.appendChild(menuItem);
    });

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuContent.classList.toggle('visible', !isExpanded);
      menuBtn.setAttribute('aria-expanded', !isExpanded);
    });

    document.addEventListener('click', (e) => {
      if (!menuContainer.contains(e.target)) {
        menuContent.classList.remove('visible');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    menuContainer.appendChild(menuBtn);
    menuContainer.appendChild(menuContent);

    return menuContainer;
  };

  const updateProgress = (container, current, total) => {
    const progressBar = container.querySelector('.bottom-bar-progress');
    if (!progressBar) return;

    progressBar.setAttribute('aria-valuenow', current);
    progressBar.setAttribute('aria-valuemax', total);

    const steps = progressBar.querySelectorAll('.progress-step');
    steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < current) {
        step.classList.add('completed');
      } else if (i === current) {
        step.classList.add('active');
      }
    });
  };

  const updateButton = (container, buttonId, updates) => {
    const button = container.querySelector(`#${buttonId}`);
    if (!button) return;

    if (updates.disabled !== undefined) {
      if (updates.disabled) {
        button.setAttribute('disabled', 'disabled');
      } else {
        button.removeAttribute('disabled');
      }
    }

    if (updates.hidden !== undefined) {
      button.style.display = updates.hidden ? 'none' : '';
    }

    if (updates.label !== undefined) {
      const labelSpan = button.querySelector('.btn-label');
      if (labelSpan) labelSpan.textContent = updates.label;
    }
  };

  const setupKeyboardNavigation = (container, handlers = {}) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && handlers.onEscape) {
        e.preventDefault();
        handlers.onEscape(e);
      }

      if (e.key === 'Enter' && handlers.onEnter) {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement.tagName !== 'BUTTON') {
          e.preventDefault();
          handlers.onEnter(e);
        }
      }

      if (e.key === 'ArrowLeft' && handlers.onPrevious) {
        e.preventDefault();
        handlers.onPrevious(e);
      }

      if (e.key === 'ArrowRight' && handlers.onNext) {
        e.preventDefault();
        handlers.onNext(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    create: createBottomBar,
    updateProgress,
    updateButton,
    setupKeyboardNavigation
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BottomBar;
}
