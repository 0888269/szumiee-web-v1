(() => {
  const descriptions = [
    '从原理图到实物电路，学习元器件选型、PCB布局布线、焊接与调试，完成电路设计和制作实践。',
    '学习数据类型、流程控制、函数、数组与指针，通过编程练习建立面向嵌入式开发的C语言基础。',
    '认识51单片机架构，练习GPIO、定时器、中断与串口通信，完成基础外设控制。',
    '学习32位单片机开发流程、外设配置与调试，掌握GPIO、ADC、定时器和通信接口的基本使用。',
    '围绕生理信号采集，认识传感器、模拟前端、放大与滤波电路，理解医学电子系统的基本组成。',
    '学习生理信号的采样、滤波、特征提取与分析，并结合典型信号开展处理实践。',
    '学习医用仪器的软件结构、数据通信、界面交互和测试方法，将采集数据转化为可读的仪器界面。',
    '围绕多参数监护设备，开展采集前端、主控、电源和通信模块的硬件设计与联调。',
    '在嵌入式平台实现监护信号处理与参数计算，关注资源约束、实时性及算法验证。',
    '开发监护上位机的数据接收、波形显示、参数展示与记录功能，完成软硬件通信联调。',
    '整合三类监护参数的采集、处理与显示，练习系统集成、接口协作和功能验证。',
    '进一步练习DMA、多外设协同、驱动组织和性能调试，提升复杂嵌入式系统开发能力。',
    '学习处理器、存储器、总线和中断机制，理解软硬件接口与程序执行的底层过程。',
    '学习任务调度、任务间通信、同步与资源管理，练习实时操作系统中的多任务开发。',
    '学习Linux命令行、开发工具链、进程与文件操作，建立Linux环境下的基础开发能力。',
    '练习使用AI工具辅助检索、编程、调试和文档整理，同时关注结果核验、数据隐私与使用边界。'
  ];
  let active = null;
  let pinnedItem = null;
  const closeHandlers = new Map();
  window.addEventListener('scroll', () => {
    closeHandlers.forEach(close => close());
  }, { passive: true });
  document.querySelectorAll('.courses .features li').forEach((li, i) => {
    if (i >= descriptions.length || /^\.+$/.test(li.textContent.trim())) return;
    const name = li.textContent.trim();
    li.textContent = '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'course-trigger';
    button.textContent = name;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `course-description-${i}`);
    const card = document.createElement('div');
    card.id = `course-description-${i}`;
    card.className = 'course-card';
    card.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('div');
    const text = document.createElement('p');
    text.textContent = descriptions[i];
    inner.append(text);
    const books = document.createElement('div');
    books.className = 'course-books';
    for (let slot = 1; slot <= 1; slot++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'course-book-placeholder';
      placeholder.textContent = '书本封面待添加';
      placeholder.setAttribute('aria-label', `${name}书本封面占位${slot}`);
      books.append(placeholder);
    }
    inner.append(books);
    card.append(inner);
    li.append(button, card);
    let timer;
    let pinned = false;
    const show = (open) => {
      if (open) {
        if (active && active !== li) closeHandlers.get(active)();
        active = li;
        const desiredLeft = button.offsetLeft + button.offsetWidth + 12;
        const available = window.innerWidth - li.getBoundingClientRect().left - 24;
        card.style.left = window.innerWidth > 768 ? `${Math.max(0, Math.min(desiredLeft, available - card.offsetWidth))}px` : '';
      } else if (active === li) active = null;
      if (pinned) pinnedItem = li;
      else if (pinnedItem === li) pinnedItem = null;
      li.classList.toggle('is-open', open);
      li.classList.toggle('is-pinned', pinned);
      button.setAttribute('aria-expanded', String(open));
      card.setAttribute('aria-hidden', String(!open));
    };
    closeHandlers.set(li, () => { clearTimeout(timer); pinned = false; show(false); });
    const schedule = () => {
      clearTimeout(timer);
      if (!pinned && !pinnedItem) timer = setTimeout(() => {
        if (!pinnedItem) show(true);
      }, 1500);
    };
    button.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'touch') schedule();
    });
    li.addEventListener('pointerleave', () => {
      clearTimeout(timer);
      if (!pinned) show(false);
    });
    button.addEventListener('focus', schedule);
    button.addEventListener('blur', () => {
      clearTimeout(timer);
      if (!pinned) show(false);
    });
    button.addEventListener('click', () => {
      clearTimeout(timer);
      pinned = !pinned;
      show(pinned);
    });
    button.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        clearTimeout(timer);
        pinned = false;
        show(false);
      }
    });
  });
})();
