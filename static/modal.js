
const modalOverlay = document.createElement('div');
modalOverlay.style.position = 'fixed';
modalOverlay.style.top = '0';
modalOverlay.style.left = '0';
modalOverlay.style.width = '100%';
modalOverlay.style.height = '100%';
modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
modalOverlay.style.backdropFilter = 'blur(8px)';
modalOverlay.style.WebkitBackdropFilter = 'blur(8px)';
modalOverlay.style.display = 'flex';
modalOverlay.style.alignItems = 'center';
modalOverlay.style.justifyContent = 'center';
modalOverlay.style.zIndex = '9999';
modalOverlay.style.opacity = '0';
modalOverlay.style.transition = 'opacity 0.3s ease-in-out';

const container = document.createElement('div');
container.style.fontFamily = '"Inter", system-ui, sans-serif';
container.style.textAlign = 'center';
container.style.padding = '4rem 3rem';
container.style.maxWidth = '550px';
container.style.width = '90%';
container.style.margin = '0 auto';
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.justifyContent = 'center';
container.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
container.style.borderRadius = '24px';
container.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
container.style.transform = 'translateY(30px)';
container.style.opacity = '0';
container.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';

const icon = document.createElement('div');
icon.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF4A6B" stroke-width="2"/><path d="M15 9L9 15M9 9L15 15" stroke="#FF4A6B" stroke-width="2" stroke-linecap="round"/></svg>';

const heading = document.createElement('h1');
heading.textContent = 'Invalid AWS LPU CAPTCHA KEY';
heading.style.color = '#1a1a2e';
heading.style.fontSize = 'clamp(1.5rem, 5vw, 2.5rem)';
heading.style.fontWeight = '700';
heading.style.margin = '2rem 0 1rem';
heading.style.letterSpacing = '-0.03em';

const description = document.createElement('p');
description.textContent = 'The CAPTCHA service cannot be loaded with the current configuration.';
description.style.color = '#4a4a68';
description.style.fontSize = '1.125rem';
description.style.lineHeight = '1.6';
description.style.maxWidth = '85%';
description.style.margin = '0 auto 2.5rem';

const backLink = document.createElement('a');
backLink.textContent = 'Return to Home';
backLink.href = '/';
backLink.style.display = 'inline-block';
backLink.style.padding = '0.875rem 2rem';
backLink.style.backgroundColor = '#0066FF';
backLink.style.color = 'white';
backLink.style.textDecoration = 'none';
backLink.style.borderRadius = '12px';
backLink.style.fontWeight = '600';
backLink.style.fontSize = '1rem';
backLink.style.transition = 'all 0.2s ease';
backLink.style.boxShadow = '0 10px 15px -3px rgba(0, 102, 255, 0.3)';

backLink.onmouseover = () => {
    backLink.style.transform = 'translateY(-2px)';
    backLink.style.boxShadow = '0 15px 20px -3px rgba(0, 102, 255, 0.4)';
};
backLink.onmouseout = () => {
    backLink.style.transform = 'translateY(0)';
    backLink.style.boxShadow = '0 10px 15px -3px rgba(0, 102, 255, 0.3)';
};

const closeButton = document.createElement('button');
closeButton.innerHTML = '&times;';
closeButton.style.position = 'absolute';
closeButton.style.top = '20px';
closeButton.style.right = '20px';
closeButton.style.background = 'transparent';
closeButton.style.border = 'none';
closeButton.style.fontSize = '28px';
closeButton.style.fontWeight = 'bold';
closeButton.style.cursor = 'pointer';
closeButton.style.color = '#1a1a2e';
closeButton.style.height = '40px';
closeButton.style.width = '40px';
closeButton.style.borderRadius = '50%';
closeButton.style.display = 'flex';
closeButton.style.alignItems = 'center';
closeButton.style.justifyContent = 'center';
closeButton.style.transition = 'background 0.2s ease';

closeButton.onmouseover = () => {
    closeButton.style.background = 'rgba(0, 0, 0, 0.1)';
};
closeButton.onmouseout = () => {
    closeButton.style.background = 'transparent';
};
closeButton.onclick = () => {
    modalOverlay.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    container.style.opacity = '0';
    
    setTimeout(() => {
        document.body.removeChild(modalOverlay);
    }, 500);
};

const containerWrapper = document.createElement('div');
containerWrapper.style.position = 'relative';
containerWrapper.style.borderRadius = '24px';
containerWrapper.style.overflow = 'hidden';

containerWrapper.appendChild(closeButton);
containerWrapper.appendChild(container);
container.appendChild(icon);
container.appendChild(heading);
container.appendChild(description);
container.appendChild(backLink);
modalOverlay.appendChild(containerWrapper);

document.body.appendChild(modalOverlay);

setTimeout(() => {
    modalOverlay.style.opacity = '1';
    container.style.transform = 'translateY(0)';
    container.style.opacity = '1';
}, 100);
