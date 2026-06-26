let windows = 
{
    'home': document.getElementById('home-window'),
    'projects': document.getElementById('projects-window'),
    'network-neighborhood': document.getElementById('network-neighborhood-window'),
    'silly-business': document.getElementById('silly-business-window'),
    'about': document.getElementById('about-window'),
    'contacts': document.getElementById('contacts-window'),
    'artwork': document.getElementById('artwork-window'),
    'writing': document.getElementById('writing-window'),
    'advert': document.getElementById('advert-window'),
    'start-menu': document.getElementById('start-menu')
};

let windowStates = {};
Object.keys(windows).forEach(key => {
    windowStates[key] = 'normal';});
            
let draggedWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// all draggable
document.querySelectorAll('.window').forEach(window => {
    const titleBar = window.querySelector('.title-bar');

    titleBar.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('window-btn')) return;         
        if (window.classList.contains('maximized')) return;
                
        draggedWindow = window;
        dragOffsetX = e.clientX - window.offsetLeft;
        dragOffsetY = e.clientY - window.offsetTop;
                
        bringWindowToFront(window);
                
        e.preventDefault();
            });
        });

document.addEventListener('mousemove', function(e) {
    if (!draggedWindow) return;
            
    let newLeft = e.clientX - dragOffsetX;
    let newTop = e.clientY - dragOffsetY;
            
    const maxLeft = window.innerWidth - draggedWindow.offsetWidth;
    const maxTop = window.innerHeight - draggedWindow.offsetHeight - 40;
            
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
            
    draggedWindow.style.left = newLeft + 'px';
    draggedWindow.style.top = newTop + 'px';
    });


document.addEventListener('mouseup', function() {
    draggedWindow = null;
    });

function bringWindowToFront(window) {
   
    const allWindows = document.querySelectorAll('.window');
    let highestZIndex = 100; 
            
        allWindows.forEach(win => {
            const zIndex = parseInt(window.getComputedStyle(win).zIndex) || 100;
            highestZIndex = Math.max(highestZIndex, zIndex);
            });
            
            window.style.zIndex = highestZIndex + 1;
    }

function openWindow(windowId) {
    const window = windows[windowId];
    if (!window) return;
            
    window.classList.remove('hidden');
    window.classList.remove('minimized');
    bringWindowToFront(window);
    addToTaskbar(windowId);

    if (windowStates[windowId] === 'maximized') {
    window.classList.add('maximized');
        }
    }

function closeWindow(windowId) 
{
    const window = windows[windowId];
    window.classList.add('hidden');
    window.classList.remove('maximized');
    windowStates[windowId] = 'normal';
            
    removeFromTaskbar(windowId);
}

function minimizeWindow(windowId) 
{
    const window = windows[windowId];
    window.classList.add('minimized');
    windowStates[windowId] = 'minimized';
    updateTaskbarItem(windowId);
}

function maximizeWindow(windowId) 
{
    const window = windows[windowId];
    if (windowStates[windowId] === 'maximized') 
        {
        window.classList.remove('maximized');
        windowStates[windowId] = 'normal';
        } 
        else 
            {
                window.classList.add('maximized');
                windowStates[windowId] = 'maximized';
            }
}

function toggleStartMenu() 
{
    const startMenu = windows['start-menu'];
    if (startMenu.classList.contains('hidden')) 
        {
            openWindow('start-menu');
            startMenu.style.left = '0px';
            startMenu.style.top = 'auto';
            startMenu.style.bottom = '40px';
            startMenu.style.zIndex = '2000';
        } 
        else 
            {
                closeWindow('start-menu');
            }
        }

function addToTaskbar(windowId) 
{
    const taskbarItems = document.getElementById('taskbarItems');
    const window = windows[windowId];
    const title = window.querySelector('.title-text').textContent;
            
    if (document.getElementById(`taskbar-${windowId}`)) 
        {
            updateTaskbarItem(windowId);
            return;
        }
            
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.id = `taskbar-${windowId}`;
    taskbarItem.textContent = title;
    taskbarItem.onclick = () => 
        {
            if (windowStates[windowId] === 'minimized') 
            {
                openWindow(windowId);
            } 
            else    
                {
                    minimizeWindow(windowId);
                }
        };
            
        taskbarItems.appendChild(taskbarItem);
        updateTaskbarItem(windowId);
}

function removeFromTaskbar(windowId) 
{
    const taskbarItem = document.getElementById(`taskbar-${windowId}`);
        if (taskbarItem) 
            {
                taskbarItem.remove();
            }
}

function updateTaskbarItem(windowId) 
{
    const taskbarItem = document.getElementById(`taskbar-${windowId}`);
    if (!taskbarItem) return;
            
    const window = windows[windowId];
        if (windowStates[windowId] === 'minimized' || window.classList.contains('hidden')) 
            {
                taskbarItem.classList.remove('active');
            } 
            else 
                {
                taskbarItem.classList.add('active');
                }
        }

function toggleFolder(element) 
{
    element.classList.toggle('open');
}

function updateClock() 
{
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true });
    document.getElementById('clock').textContent = timeString;
}


document.addEventListener('DOMContentLoaded', () => 
{
    updateClock();
    setInterval(updateClock, 60000);
            
    // brings window to front when clicked
    document.querySelectorAll('.window').forEach(window => 
        {
        window.addEventListener('mousedown', (e) =>
            {

            if (e.target.closest('.title-bar')) return;
            bringWindowToFront(window);
            });
        });
            
    // closes start menu when clicking outside
    document.addEventListener('click', (e) => 
        {
        const startMenu = windows['start-menu'];
        if (!startMenu.classList.contains('hidden')) 
            {
            if (!e.target.closest('#start-menu') && !e.target.closest('.start-btn')) 
                {
                closeWindow('start-menu');
                }
            }
        });
            
    // opened by default
    openWindow('home');
});

// art gallary logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const caption = document.getElementById("modalCaption");
const closeBtn = modal.querySelector(".close");

document.querySelectorAll(".card img").forEach(img => 
{

    img.addEventListener("click", () => 
    {
        modal.style.display = "block";

        modalImg.src = img.src;
        modalImg.alt = img.alt;

        const desc = img.parentElement.querySelector(".desc");
        caption.innerHTML = desc ? desc.innerHTML : "";
    });

});

closeBtn.onclick = () => 
{
    modal.style.display = "none";
};

modal.onclick = (e) => 
{
    if (e.target === modal)
        modal.style.display = "none";
};