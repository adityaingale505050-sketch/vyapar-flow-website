document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Switcher ──────────────────────────────────────────────
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark) {
    htmlElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  }

  // ── Navbar Scroll Style ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── Mobile Menu Toggle ───────────────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? '' : 'flex';
    navLinks.style.flexDirection = isVisible ? '' : 'column';
    navLinks.style.position = isVisible ? '' : 'absolute';
    navLinks.style.top = isVisible ? '' : '100%';
    navLinks.style.left = isVisible ? '' : '0';
    navLinks.style.width = isVisible ? '' : '100%';
    navLinks.style.background = isVisible ? '' : 'var(--bg-secondary)';
    navLinks.style.padding = isVisible ? '' : '20px';
    navLinks.style.borderBottom = isVisible ? '' : '1px solid var(--border-color)';
    
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = isVisible ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
  });

  // ── Simulator Tab Switching ──────────────────────────────────────
  const tabButtons = document.querySelectorAll('.sim-tab-btn');
  const panels = document.querySelectorAll('.sim-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons & panels
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active to current
      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.getAttribute('data-target'));
      targetPanel.classList.add('active');
    });
  });

  // ── Interactive Invoice Simulator ─────────────────────────────────
  const shopNameInput = document.getElementById('shopName');
  const shopGstinInput = document.getElementById('shopGstin');
  const custNameInput = document.getElementById('custName');
  const custPhoneInput = document.getElementById('custPhone');

  const lblShopName = document.getElementById('lblShopName');
  const lblShopGstin = document.getElementById('lblShopGstin');
  const lblCustName = document.getElementById('lblCustName');
  const lblCustPhone = document.getElementById('lblCustPhone');

  const invoiceItemsList = document.getElementById('invoiceItemsList');
  const previewInvoiceBody = document.getElementById('previewInvoiceBody');

  const lblSubtotal = document.getElementById('lblSubtotal');
  const lblCgst = document.getElementById('lblCgst');
  const lblSgst = document.getElementById('lblSgst');
  const lblGrandTotal = document.getElementById('lblGrandTotal');
  const lblAmountInWords = document.getElementById('lblAmountInWords');
  const btnAddRowBtn = document.getElementById('btnAddRowBtn');

  // Predefined Items List
  let lineItems = [
    { desc: "Copper Wire 1.5mm", qty: 5, price: 1550, gst: 18 },
    { desc: "LED Bulb 9W (Syska)", qty: 10, price: 120, gst: 12 }
  ];

  // Sync general invoice metadata inputs
  function syncGeneralMetadata() {
    lblShopName.textContent = shopNameInput.value || "My Business";
    lblShopGstin.textContent = shopGstinInput.value || "Not Specified";
    lblCustName.textContent = custNameInput.value || "Cash Sale";
    lblCustPhone.textContent = custPhoneInput.value || "-";
  }

  [shopNameInput, shopGstinInput, custNameInput, custPhoneInput].forEach(input => {
    input.addEventListener('input', syncGeneralMetadata);
  });

  // Convert numbers to Indian Rupee word format
  function numberToIndianWords(num) {
    if (num === 0) return "Zero Rupees Only";
    
    const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const double = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    function convertNumber(n) {
      let str = "";
      if (n >= 10000000) {
        str += convertNumber(Math.floor(n / 10000000)) + " Crore ";
        n %= 10000000;
      }
      if (n >= 100000) {
        str += convertNumber(Math.floor(n / 100000)) + " Lakh ";
        n %= 100000;
      }
      if (n >= 1000) {
        str += convertNumber(Math.floor(n / 1000)) + " Thousand ";
        n %= 1000;
      }
      if (n >= 100) {
        str += convertNumber(Math.floor(n / 100)) + " Hundred ";
        n %= 100;
      }
      if (n > 0) {
        if (str !== "") str += "and ";
        if (n < 10) str += single[n];
        else if (n < 20) str += double[n - 10];
        else {
          str += tens[Math.floor(n / 10)];
          if (n % 10 > 0) str += " " + single[n % 10];
        }
      }
      return str.trim();
    }

    const integerPart = Math.floor(num);
    const fractionalPart = Math.round((num - integerPart) * 100);
    
    let words = convertNumber(integerPart) + " Rupees";
    if (fractionalPart > 0) {
      words += " and " + convertNumber(fractionalPart) + " Paisa";
    }
    words += " Only";
    
    return words;
  }

  // Format currency numbers
  function formatINR(val) {
    return "₹" + val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Render Editor Table Rows & Sync to Preview Panel
  function renderInvoiceEditor() {
    invoiceItemsList.innerHTML = "";
    previewInvoiceBody.innerHTML = "";
    
    let subtotal = 0;
    let totalGst = 0;
    
    lineItems.forEach((item, index) => {
      // 1. Render Editor Inputs
      const editorRow = document.createElement('tr');
      editorRow.innerHTML = `
        <td><input type="text" class="form-control val-desc" data-index="${index}" value="${item.desc}"></td>
        <td><input type="number" class="form-control val-qty" data-index="${index}" value="${item.qty}" min="1" style="text-align: center;"></td>
        <td><input type="number" class="form-control val-price" data-index="${index}" value="${item.price}" min="0"></td>
        <td>
          <select class="form-control val-gst" data-index="${index}">
            <option value="0" ${item.gst === 0 ? 'selected' : ''}>0%</option>
            <option value="5" ${item.gst === 5 ? 'selected' : ''}>5%</option>
            <option value="12" ${item.gst === 12 ? 'selected' : ''}>12%</option>
            <option value="18" ${item.gst === 18 ? 'selected' : ''}>18%</option>
            <option value="28" ${item.gst === 28 ? 'selected' : ''}>28%</option>
          </select>
        </td>
        <td style="text-align: center;"><button class="btn-delete-row" data-index="${index}" style="background: none; border: none; color: var(--alert-red); cursor: pointer;"><i class="fa-solid fa-trash"></i></button></td>
      `;
      invoiceItemsList.appendChild(editorRow);

      // Math computations
      const itemSubtotal = item.qty * item.price;
      const itemGst = itemSubtotal * (item.gst / 100);
      const itemTotal = itemSubtotal + itemGst;
      
      subtotal += itemSubtotal;
      totalGst += itemGst;

      // 2. Render Preview PDF Item Row
      const previewRow = document.createElement('tr');
      previewRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.desc || "Untitled Item"}</td>
        <td class="text-right">${item.qty}</td>
        <td class="text-right">${formatINR(item.price)}</td>
        <td class="text-right">${item.gst}%</td>
        <td class="text-right">${formatINR(itemTotal)}</td>
      `;
      previewInvoiceBody.appendChild(previewRow);
    });

    // Compute grand sums
    const cgstSplit = totalGst / 2;
    const sgstSplit = totalGst / 2;
    const grandTotal = subtotal + totalGst;

    // Update labels in visual preview
    lblSubtotal.textContent = formatINR(subtotal);
    lblCgst.textContent = formatINR(cgstSplit);
    lblSgst.textContent = formatINR(sgstSplit);
    lblGrandTotal.textContent = formatINR(grandTotal);
    lblAmountInWords.textContent = numberToIndianWords(grandTotal);

    attachEditorListeners();
  }

  function attachEditorListeners() {
    // Listen to changes in the editors
    document.querySelectorAll('.val-desc').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = e.target.getAttribute('data-index');
        lineItems[index].desc = e.target.value;
        renderInvoiceEditor();
      });
    });

    document.querySelectorAll('.val-qty').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = e.target.getAttribute('data-index');
        lineItems[index].qty = Math.max(1, parseInt(e.target.value) || 1);
        renderInvoiceEditor();
      });
    });

    document.querySelectorAll('.val-price').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = e.target.getAttribute('data-index');
        lineItems[index].price = Math.max(0, parseFloat(e.target.value) || 0);
        renderInvoiceEditor();
      });
    });

    document.querySelectorAll('.val-gst').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = e.target.getAttribute('data-index');
        lineItems[index].gst = parseInt(e.target.value);
        renderInvoiceEditor();
      });
    });

    // Delete Row Listener
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = btn.getAttribute('data-index');
        lineItems.splice(index, 1);
        renderInvoiceEditor();
      });
    });
  }

  // Add Item Click Row
  btnAddRowBtn.addEventListener('click', () => {
    lineItems.push({ desc: "", qty: 1, price: 0, gst: 18 });
    renderInvoiceEditor();
  });

  // Initial Sync
  syncGeneralMetadata();
  renderInvoiceEditor();


  // ── Dashboard Simulator Chart Interactive Points ──────────────────
  const chartPoints = document.querySelectorAll('.chart-point');
  const dashSalesVal = document.getElementById('dashSalesVal');
  
  chartPoints.forEach(point => {
    point.addEventListener('mouseenter', (e) => {
      const hoverVal = e.target.getAttribute('data-val');
      dashSalesVal.textContent = hoverVal;
      dashSalesVal.style.color = 'var(--primary-teal)';
      point.style.fill = 'var(--primary-teal-hover)';
    });

    point.addEventListener('mouseleave', () => {
      dashSalesVal.textContent = '₹48,250';
      dashSalesVal.style.color = '';
      point.style.fill = 'var(--primary-teal)';
    });
  });

  // ── Setup Wizard Navigation ──────────────────────────────────────
  const wizardNavButtons = document.querySelectorAll('.wizard-step-nav');
  const wizardPanels = document.querySelectorAll('.wizard-panel');
  const btnWizardPrev = document.getElementById('btnWizardPrev');
  const btnWizardNext = document.getElementById('btnWizardNext');
  let currentStep = 1;

  function showStep(stepIndex) {
    currentStep = stepIndex;

    // Update nav buttons
    wizardNavButtons.forEach(btn => {
      const stepNum = parseInt(btn.getAttribute('data-step'));
      if (stepNum === stepIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update panels
    wizardPanels.forEach(panel => {
      const panelNum = parseInt(panel.id.replace('step-panel-', ''));
      if (panelNum === stepIndex) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update bottom trigger buttons
    btnWizardPrev.disabled = currentStep === 1;
    if (currentStep === 4) {
      btnWizardNext.innerHTML = 'Complete <i class="fa-solid fa-check"></i>';
    } else {
      btnWizardNext.innerHTML = 'Next Step <i class="fa-solid fa-arrow-right"></i>';
    }
  }

  wizardNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(parseInt(btn.getAttribute('data-step')));
    });
  });

  btnWizardPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });

  btnWizardNext.addEventListener('click', () => {
    if (currentStep < 4) {
      showStep(currentStep + 1);
    } else {
      // Completed last step, scroll to CTA or FAQ
      document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ── Copy Code to Clipboard ──────────────────────────────────────
  const btnCopySetup = document.getElementById('btnCopySetup');
  const setupCodeContent = document.getElementById('setupCodeContent');

  btnCopySetup.addEventListener('click', () => {
    const textToCopy = setupCodeContent.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Visual feedback
      btnCopySetup.innerHTML = '<i class="fa-solid fa-check" style="color: var(--alert-green);"></i> Copied!';
      btnCopySetup.style.borderColor = 'var(--alert-green)';
      setTimeout(() => {
        btnCopySetup.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
        btnCopySetup.style.borderColor = '';
      }, 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });

  // ── FAQ Accordion Toggle ─────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all first
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
