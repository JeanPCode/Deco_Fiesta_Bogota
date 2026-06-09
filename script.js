     // --- 1. LÓGICA DE CONTROL DE TEMA (CLARO / OSCURO) ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
        
        // Verifica el tema guardado en visitas previas, de lo contrario inicializa en Claro ('light')
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);

        function updateThemeIcons(theme) {
            const isDark = theme === 'dark';
            // Icono de sol si es oscuro (para cambiar a claro) y de luna si es claro
            const newIconClass = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('i').className = newIconClass;
            }
            if (mobileThemeToggleBtn) {
                mobileThemeToggleBtn.querySelector('i').className = newIconClass;
            }
        }

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
            
            showToast(
                `Tema ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}`, 
                `Se ha cambiado con éxito al diseño de fondos ${newTheme === 'dark' ? 'oscuros elegantes' : 'claros luminosos'}.`, 
                "success"
            );
        }

        themeToggleBtn.addEventListener('click', toggleTheme);
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);


        // --- 2. LÓGICA DE NAVEGACIÓN Y MENÚ MÓVIL ---
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const mainHeader = document.getElementById('main-header');

        // Toggle menú móvil
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            if(mobileMenu.classList.contains('active')) {
                menuIcon.className = 'fa-solid fa-xmark';
            } else {
                menuIcon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Cerrar menú móvil al pulsar un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuIcon.className = 'fa-solid fa-bars-staggered';
            });
        });

        // Sincronizar estilo dinámico de barra al hacer scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
            detectActiveSection();
        });

        // Highlight dinámico de navegación de acuerdo al scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav.desktop-nav a');

        function detectActiveSection() {
            let scrollY = window.pageYOffset;
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 100;
                const sectionId = current.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }


        // --- 3. HERO SLIDER INTEGRADO (BOGOTÁ EVENTOS ESTIMADO) ---
        const heroSlider = document.getElementById('hero-guests-slider');
        const heroSliderVal = document.getElementById('hero-slider-val');
        const heroCalcResult = document.getElementById('hero-calc-result');
        let selectedHeroService = 'social'; // social o premium

        function selectHeroEventType(type, btn) {
            selectedHeroService = type;
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateHeroEstimate();
        }

        function updateHeroEstimate() {
            const guests = parseInt(heroSlider.value);
            heroSliderVal.textContent = `${guests} Pers.`;
            
            // Base matemática adaptada a Bogotá en COP (Pesos Colombianos)
            let basePricePerGuest = selectedHeroService === 'social' ? 14000 : 25000;
            let setupFee = selectedHeroService === 'social' ? 550000 : 980000;
            let estimatedTotal = setupFee + (guests * basePricePerGuest);

            // Formatear a pesos colombianos
            const formatted = new Intl.NumberFormat('es-CO', { 
                style: 'currency', 
                currency: 'COP', 
                maximumFractionDigits: 0 
            }).format(estimatedTotal);

            heroCalcResult.textContent = formatted;
        }

        heroSlider.addEventListener('input', updateHeroEstimate);
        updateHeroEstimate();


        // --- 4. SLIDER DE COMPARACIÓN (ANTES/DESPUÉS) ---
        const baContainer = document.getElementById('ba-container');
        const baBeforeWrap = document.getElementById('ba-before-wrap');
        const baDivider = document.getElementById('ba-divider');
        const baRangeInput = document.getElementById('ba-range-input');

        baRangeInput.addEventListener('input', (e) => {
            const value = e.target.value;
            baBeforeWrap.style.width = `${value}%`;
            baDivider.style.left = `${value}%`;
        });


        // --- 5. PORTAFOLIO DINÁMICO DE EVENTOS ---
        function filterPortfolio(category, filterButton) {
            // Setea el botón activo estéticamente
            const filterButtons = document.querySelectorAll('#portfolio-filters button');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            filterButton.classList.add('active');

            const items = document.querySelectorAll('.portfolio-card');
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'todos' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }


        // --- 6. MODAL DE GALERÍA (LIGHTBOX) ---
        const galleryImages = [
            { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80", caption: "Cumpleaños Infantil Temática Selva Orgánica en Salón Comunal" },
            { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80", caption: "Vintage Boho Chic para Matrimonios en la Sabana" },
            { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80", caption: "Gala Neón Empresarial con Muros Shimmer en Evento Corporativo" },
            { src: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80", caption: "Cumpleaños Temático Universo & Astronauta para Mateo" },
            { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80", caption: "Celebración Espectacular de 15 Años Glam Rosé en Bogotá" },
            { src: "https://images.unsplash.com/photo-1505232458627-a872948975b2?auto=format&fit=crop&w=1200&q=80", caption: "Montaje Monumental Orgánico para Inauguración de Boutique en Chapinero" }
        ];

        let currentImgIndex = 0;
        const galleryModal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');

        function openGalleryModal(index) {
            currentImgIndex = index;
            modalImage.src = galleryImages[index].src;
            modalCaption.textContent = galleryImages[index].caption;
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeGalleryModal() {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextGalleryImage() {
            currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
            modalImage.src = galleryImages[currentImgIndex].src;
            modalCaption.textContent = galleryImages[currentImgIndex].caption;
        }

        function prevGalleryImage() {
            currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
            modalImage.src = galleryImages[currentImgIndex].src;
            modalCaption.textContent = galleryImages[currentImgIndex].caption;
        }


        // --- 7. CALCULADORA DE PRESUPUESTO COMPLETA (COP) ---
        let currentQuality = 'estandar'; // esencial, estandar, premium

        function selectQuality(quality) {
            currentQuality = quality;
            
            // Actualizar botones de calidad activos
            document.querySelectorAll('.quality-btn').forEach(btn => btn.classList.remove('active'));
            let activeId = 'btn-q-est';
            if(quality === 'esencial') activeId = 'btn-q-ese';
            if(quality === 'premium') activeId = 'btn-q-pre';
            document.getElementById(activeId).classList.add('active');

            updateCalculator();
        }

        function updateCalculator() {
            const guests = parseInt(document.getElementById('calc-guests-input').value);
            document.getElementById('calc-guests-label').textContent = `${guests} Personas`;

            // Obtener tipo de servicio del radio seleccionado
            const selectedRadio = document.querySelector('input[name="calc-service-radio"]:checked');
            const selectedService = selectedRadio ? selectedRadio.value : 'social';

            // Actualizar apariencia activa del radio visual
            document.querySelectorAll('.service-type-option').forEach(el => el.classList.remove('active'));
            let activeWrapId = 'opt-service-social';
            if(selectedService === 'glam') activeWrapId = 'opt-service-glam';
            if(selectedService === 'corp') activeWrapId = 'opt-service-corp';
            document.getElementById(activeWrapId).classList.add('active');

            // Definición de Bases de Costos en COP
            let baseSetupCost = 0;
            let guestCostMultiplier = 0;
            let serviceLabel = "Social & Infantil";
            let durationLabel = "3 - 4 Horas";

            if (selectedService === 'social') {
                baseSetupCost = 500000;
                guestCostMultiplier = 12000;
                serviceLabel = "Social & Infantil";
                durationLabel = guests > 100 ? "4 - 5 Horas" : "3 - 4 Horas";
            } else if (selectedService === 'glam') {
                baseSetupCost = 1100000;
                guestCostMultiplier = 20000;
                serviceLabel = "Glam / 15 Años / Bodas";
                durationLabel = guests > 100 ? "5 - 6 Horas" : "4 - 5 Horas";
            } else if (selectedService === 'corp') {
                baseSetupCost = 1800000;
                guestCostMultiplier = 28000;
                serviceLabel = "Gala Corporativa & Neon";
                durationLabel = guests > 100 ? "6 - 8 Horas" : "5 - 6 Horas";
            }

            // Multiplicador de volumen/densidad de globos
            let densityMultiplier = 1.0;
            let densityLabel = "Abundante (Orgánico)";
            if (currentQuality === 'esencial') {
                densityMultiplier = 0.75;
                densityLabel = "Esencial (Básico)";
            } else if (currentQuality === 'premium') {
                densityMultiplier = 1.45;
                densityLabel = "De Película (Doble volumen)";
            }

            // Calcular Presupuesto Final
            const subtotal = (baseSetupCost + (guests * guestCostMultiplier)) * densityMultiplier;
            const minEstimate = subtotal * 0.9;
            const maxEstimate = subtotal * 1.1;

            // Formateador a COP sin decimales
            const formatter = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            });

            // Actualizar UI de cálculo
            document.getElementById('calc-range-min').textContent = formatter.format(minEstimate);
            document.getElementById('calc-range-max').textContent = formatter.format(maxEstimate);

            document.getElementById('summary-linea').textContent = serviceLabel;
            document.getElementById('summary-densidad').textContent = densityLabel;
            document.getElementById('summary-tiempo').textContent = durationLabel;

            // Almacenar el string en la caja oculta
            const summaryString = `Línea: ${serviceLabel} | Globos: ${densityLabel} | Invitados: ${guests} Pers. | Estimado: ${formatter.format(minEstimate)} - ${formatter.format(maxEstimate)}`;
            document.getElementById('form-calc-details').value = summaryString;
        }

        // Lockea la cotización actual, rellena el text area de contacto y hace scroll elegante
        function lockQuoteAndScroll() {
            const sumType = document.getElementById('summary-linea').textContent;
            const sumDensity = document.getElementById('summary-densidad').textContent;
            const guests = document.getElementById('calc-guests-input').value;
            const minVal = document.getElementById('calc-range-min').textContent;
            const maxVal = document.getElementById('calc-range-max').textContent;

            const textMessage = `Hola, acabo de utilizar su cotizador express en línea. Estoy interesado en un servicio de diseño decorativo para una celebración en Bogotá:\n\n` +
                                `- Tipo de evento: ${sumType}\n` +
                                `- Densidad de globos/acabados: ${sumDensity}\n` +
                                `- Número aproximado de invitados: ${guests} Personas\n` +
                                `- Rango de inversión proyectado: ${minVal} - ${maxVal}\n\n` +
                                `Por favor, me gustaría verificar disponibilidad para la fecha de mi fiesta.`;
            
            document.getElementById('message').value = textMessage;
            
            // Lanzar toast de éxito
            showToast("Presupuesto Registrado", "Hemos guardado tus valores y los inyectamos en el formulario de contacto.", "success");

            // Scroll suave hacia el formulario de contacto
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        }

        updateCalculator();


        // --- 8. SISTEMA DE TOASTS INDEPENDIENTES ---
        function showToast(title, message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            
            const iconColor = type === 'success' ? 'var(--color-green)' : 'var(--color-yellow)';
            const icon = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info';

            toast.innerHTML = `
                <div style="color: ${iconColor}; font-size: 1.2rem; margin-top: 0.1rem;"><i class="${icon}"></i></div>
                <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                    <h4 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary);">${title}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">${message}</p>
                </div>
            `;

            container.appendChild(toast);

            // Trigger animaciones (Slide Up + Fade In)
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }, 50);

            // Eliminar y transicionar de salida
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 4500);
        }


        // --- 9. ENVÍO DE FORMULARIOS ---
        function handleFormSubmit(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('event-date').value;
            
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Verificando agenda de eventos...";
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast(
                    "¡Asesoría Agendada!", 
                    `Muchas gracias ${name}. Hemos recibido tu fecha para el día ${date}. Un decorador te escribirá por WhatsApp al número ${phone} para definir tu paleta de colores de globos.`, 
                    "success"
                );
                
                // Resetear Formulario
                document.getElementById('lead-form').reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        }

        function handleNewsletterSubmit(event) {
            event.preventDefault();
            const emailInput = event.target.querySelector('input');
            const email = emailInput.value;

            showToast(
                "¡Suscrito Correctamente!", 
                `El correo ${email} ha sido añadido a nuestro catálogo de inspiración festiva de Bogotá.`, 
                "success"
            );
            emailInput.value = '';
        }


        // --- 10. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
        function toggleFaq(index) {
            const items = document.querySelectorAll('.faq-item');
            const currentItem = items[index];
            const isCurrentlyActive = currentItem.classList.contains('active');

            // Cerramos todos
            items.forEach(item => {
                item.classList.remove('active');
                const content = item.querySelector('.faq-content');
                content.style.maxHeight = '0px';
            });

            // Si no estaba activo, lo abrimos
            if (!isCurrentlyActive) {
                currentItem.classList.add('active');
                const activeContent = currentItem.querySelector('.faq-content');
                activeContent.style.maxHeight = activeContent.scrollHeight + 30 + 'px';
            }
        }