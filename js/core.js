$(document).ready(function() {

    window.lang = $('html').attr('lang');

    // Horizontal scroll buttons
    if($('.results').width() > $('.container').width()) {
        $('.scroll-buttons').removeClass('hidden');
    }

    var $scroll_page = 1;
    var $scroll_scale = ($('#tableContainer').width() - 180) * 2 / 3; // 180 = min-width for name column

    $('.scroll-left').addClass('disabled');

    $('.scroll-left').click(function(){
        var next = Math.floor($scroll_page);
        if(next == $scroll_page) {
            next--;
        }

        $('.scroll-right').removeClass('disabled');
        $('#tableContainer').animate({
            scrollLeft: $scroll_scale*(next - 1)
        }, 1000);
        if($scroll_page == 1) {
            $(this).addClass('disabled');
        } else {
            $scroll_page = next;
        }
        return false;
    });
    $('.scroll-right').click(function(){
        var next = Math.ceil($scroll_page);
        if(next == $scroll_page)
            next++;
        $('.scroll-left').removeClass('disabled');
        $('#tableContainer').animate({
            scrollLeft: $scroll_scale*(next - 1)
        }, 1000);

        if($scroll_scale*($scroll_page+1) > $('.results').width()) {
            $(this).addClass('disabled');
        } else {
            $scroll_page = next;
        }
        return false;
    });

    $('#tableContainer').scroll(function() {
        var position = $(this).scrollLeft();
        $scroll_page = position / $scroll_scale + 1;
        if(position == 0) {
            $('.scroll-left').addClass('disabled');
        } else {
            $('.scroll-left').removeClass('disabled');
        }

        if(position >= $('.results').width() - $('#tableContainer').width()) {
            $('.scroll-right').addClass('disabled');
        } else {
            $('.scroll-right').removeClass('disabled');
        }
    });
});

/* Patchs JosephK */
if (window.location.href === 'https://framadate.org/admin') {
  window.location.href = 'https://framadate.org/admin/'
}

$(document).ready(function() {
  if (!(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    || ['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform)
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document))) {
    /* Fix lang menu conflict (POST > GET) */
    jQuery('.ombre header form').on('submit', function() {
      var $url = window.location.href.replace(/&lang=[a-z]{2}/, '&lang=' + jQuery('.ombre header form [name="lang"]').val());
      if (window.location.href !== $url) {
        window.location.href = $url;
        return false;
      }
    });

    if (jQuery('#voteCSS').length === 0) {
      jQuery('head').append('<style id="voteCSS"></style>');
    }

    if (jQuery('#results2').length === 0) {
      jQuery('.results').attr('id', 'results2')
      jQuery('#results2')
        .before(`
    <table id="results1" class="results">
      <thead>${jQuery('#results2 thead').html()}</thead>
      <tbody></tbody>
    </table>`);
    }

    if (jQuery('#results2 tfoot').length === 0) {
      jQuery('#results2').append('<tfoot></tfoot>');
      jQuery('#results2 tfoot').append(
        jQuery('#results2 tbody #addition')
      );
      if (jQuery('#addition td').length < jQuery('#results2 tbody tr:last-child').children().length) {
        jQuery('#addition').append('<td></td>');
      }
    }

    jQuery('#tableContainer').addClass('t-sticky');

    // #vote-form alias + move in thead
    jQuery('#results1 tbody').append(jQuery('#results2 tbody tr.hidden-print').clone().attr('id', 'vote-form'));
    jQuery('#results2 tbody tr.hidden-print td').children().remove();

    jQuery('#vote-form').addClass('mouseable');
    document.onkeydown = (event) => {
      if (/^(9|37|38|39|40)$/.test(event.keyCode)) { // keyboard navigation detected (tab|left|up|right|down)
        jQuery('#vote-form').removeClass('mouseable');
        jQuery('#vote-form').addClass('kb-only');
        jQuery('#tableContainer').removeClass('t-sticky');
      }
    };

    updateTableCSS = () => {
      let choicesColWidth = 64;
      let css = '';

      jQuery('#results1 thead tr:last-child').children('[id], [headers]').each(i => {
        if (jQuery('#results1 thead tr:last-child').children(`:eq(${i + 1})`).width() > 90
          || jQuery('#vote-form').length === 0) {
          choicesColWidth = 100;
        } else {
          choicesColWidth = Math.max(jQuery('#results1 thead tr:last-child').children(`:eq(${i + 1})`).width(), choicesColWidth);
        }
      });

      css += `
    table.results tr > :nth-child(n + 1) {
      width: ${choicesColWidth}px;
      min-width: ${choicesColWidth}px;
      max-width: ${choicesColWidth}px;
    }

    table.results tr > :first-child {
      left: 0;
      z-index: 1;
    }
  `;


      jQuery('#voteCSS').text(`
  @media screen {
    /* Sticky shoes, sticky shoes... */
    #tableContainer.t-sticky {
      overflow: unset !important;
    }

    #tableContainer.t-sticky #addition,
    #tableContainer.t-sticky #results1,
    #tableContainer.t-sticky .results tr > :first-child {
      position: -webkit-sticky;
      position: -moz-sticky;
      position: -ms-sticky;
      position: -o-sticky;
      position: sticky;
    }

    #tableContainer #hint {
      position: fixed;
    }

    #tableContainer.t-sticky #results1 .scroll-left,
    #tableContainer.t-sticky #results1 .scroll-right,
    #tableContainer.t-sticky #hint,
    #tableContainer.t-sticky #chartBtn,
    #tableContainer.t-sticky #commentsBtn {
      position: absolute;
    }

    #tableContainer #results2 thead,
    #tableContainer #results1 .scroll-left,
    #tableContainer #results1 .scroll-right {
      display: none;
    }

    #tableContainer.t-sticky #results1 .scroll-left,
    #tableContainer.t-sticky #results1 .scroll-right,
    #tableContainer.t-sticky .results thead,
    #tableContainer.t-sticky .results tfoot,
    #tableContainer.t-sticky .results tbody {
      display:block;
    }

    /* New design */

    table.results {
      border-collapse: initial;
    }

    #results1 thead th {
      border-right: 1px solid white;
      border-left: 1px solid white;
    }

    #vote-form th {
      max-width: initial;
    }

    #addition td {
      text-align:center;
      padding:1px 1px;
      border: 0;
      z-index: 0;
    }

    #addition .glyphicon-star {
      z-index: -1
    }

    #vote-form td {
      background: transparent;
    }

    #vote-form .bg-info:first-child {
      padding: 5px 5px 0 0 !important;
      background: #ccc;
    }

    #vote-form .glyphicon-user {
      font-size: 150%;
    }

    #vote-form {
      background: linear-gradient(to right, #CAC9CC, transparent);
      border-left: 1px solid #bbb;
    }

    #vote-form td {
      border-top: 0;
    }

    #vote-form .btn-success {
      margin-left: 15px;
    }

    #vote-form input,
    #vote-form .input-group-addon {
      border-color: transparent;
      border-radius: 0;
      box-shadow: none;
    }

    #vote-form .input-group-addon {
      background: transparent;
    }

    .results tbody tr td:last-of-type { border-color: transparent; }

    .results tbody tr th {
      background: #fff;
      padding: 5px;
      text-align: right !important;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .results tbody tr th .btn,
    span.edit-username-left {
      float: left;
      margin-right: 5px;
    }

    .results thead tr:last-child {
      background: linear-gradient(to right, #EBE9F0, transparent);
      border-bottom: 0;
    }

    .results thead tr:last-child th:last-child {
      height: 44px;
    }

    .results thead tr:nth-of-type(n+1) th.bg-info {
      background: transparent;
      border-bottom: 0;
    }

    .results thead tr th[role="presentation"] {
      border-color: transparent;
      max-width: initial;
      background: #fff;
    }

    .results tbody tr:nth-child(even) {
      background: #f6f5f9;
      filter: contrast(1);
    }

    .results tbody tr:nth-child(odd) {
      background: #f6f5f9;
      filter: contrast(0.95);
    }

    .results tbody tr td {
      filter: contrast(0.95);
    }

    .results tbody tr td.bg-info {
      background-color: transparent;
    }

    .results tbody th.bg-info,
    table.results tbody td {
      border-color: transparent;
    }

    .results tbody tr:hover {
      background: #EDEBF1;
      background: repeating-linear-gradient( -45deg, #fbfbfb, #fbfbfb 10px, #EBE9F0 10px, #EBE9F0 20px );
    }

    .results tbody tr:hover td {
      filter: contrast(1.05);
    }

    .results tbody tr td:last-child {
      filter: contrast(1.05);
    }

    .results #vote-form td:not(:last-child) {
      border-bottom: 1px solid #bbb;
    }

    .results tbody tr td:last-child,
    .results tfoot tr td:first-child {
      background: #fff;
    }

    .results .bg-info {
      font-weight: normal;
    }

    #results1 thead tr th:last-child:empty,
    #results2 tbody tr td:last-child:empty{
      visibility: hidden;
    }

    #result2 tfoot a {
      border-top: 1px solid #bbb;
    }

    ${css}

    table.results tr > :first-child {
      width: 180px;
      min-width: 180px;
      max-width: 180px;
    }

    table.results tr > :last-child {
      width: 145px;
      min-width: 145px;
      max-width: 145px;
    }

    table.results tbody tr td:last-child.hidden-print {
      width: 80px;
    }

    #results1 {
      top: 0;
      z-index: 1;
    }

    #results2,
    #results1 thead {
      overflow-y: hidden;
    }

    #results1 thead,
    #results1 tbody,
    #results2 tfoot {
      overflow-x: hidden;
      background: #fff;
    }

    #results2 tbody {
      overflow: auto;
    }
  }

  .glyphicon-ban-circle::before {
    content: "";
  }

  .glyphicon-remove::before {
    content: "";
  }

  .idontknow input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0px, 0px, 0px, 0px);
    border: 0 none;
  }

  .idontknow .btn {
    width: 35px;
    color: #999;
    font-weight: bold;
    font-size: 14px !important;
  }

  .idontknow input[type="radio"]:checked + label {
    color: #888;
    background-color: #fff;
    border-color: #bbb;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.125) inset;
  }

  #vote-form td {
    height: 68px;
    position: relative;
  }

  #results2 #vote-form td {
    height: 1px;
    padding: 0 !important;
    margin: 0;
    visibility: hidden;
  }

  #vote-form li .btn {
    border-radius: 0px !important;
    width: 26px;
    height:26px;
    line-height: 24px;
    margin: 0 auto !important;
    text-align: center;
    padding: 0;
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.3);
  }

  #vote-form input[type="radio"]:not(:checked) + label:hover {
    background: #fff !important;
  }

  #vote-form input[type="radio"]:not(:checked) + label {
    display: none;
  }

  #vote-form.kb-only td input[type="radio"] + label,
  #vote-form.mouseable td:hover input[type="radio"] + label,
  #vote-form .focused input[type="radio"] + label {
    display: block;
    box-shadow: none;
    border: none;
    margin: 0 auto;
  }

  #vote-form.kb-only ul,
  #vote-form.mouseable td:hover ul,
  #vote-form .focused ul {
    position: absolute;
    padding: 0px;
    background: radial-gradient(#ccc, #fff 32px);
    border:1px solid #bbb;
    box-shadow: none;
  }

  #vote-form.kb-only .focused ul,
  #vote-form.mouseable td:hover ul,
  #vote-form .focused ul {
    width:63px;
    height: 63px;
    top: calc(50% - 32px);
    left: calc(50% - 32px);
    z-index: 13;
  }

  #vote-form.kb-only ul {
    opacity: 0.8;
    filter: grayscale(1);
    width: 59px; /* 63 - 4 */
    height: 59px;
    top: calc(50% - 30px); /* 32 - 2 */
    left: calc(50% - 30px);
  }

  #vote-form.kb-only .focused ul {
    opacity: 1;
    filter: grayscale(0);
  }

  #vote-form.kb-only td ul li,
  #vote-form.mouseable td:hover ul li,
  #vote-form .focused ul li {
    position: absolute;
  }

  #vote-form .yes { left: 0px; top: 0px; }
  #vote-form .ifneedbe { left: 0px; bottom: 0px; }
  #vote-form .no { right: 0px; top: 0px; }
  #vote-form .idontknow { right: 0px; bottom: 0px; }

  #vote-form.kb-only td ul .yes i,
  #vote-form.kb-only td ul .no i {
    font-size: 20px;
    line-height: 25px;
  }

  #vote-form.kb-only .focused ul .yes i,
  #vote-form.kb-only .focused ul .no i,
  #vote-form.mouseable td:hover ul .yes i,
  #vote-form.mouseable td:hover ul .no i,
  #vote-form .focused ul .yes i,
  #vote-form .focused ul .no i {
    font-size: 20px;
    line-height: 27px;
  }

  #vote-form.kb-only ul li .btn {
    width: 28px;
    height: 28px;
    line-height: 28px;
  }

  #vote-form.mouseable td:hover ul li .btn,
  #vote-form .focused ul li .btn {
    width: 30px;
    height: 30px;
    line-height: 30px;
  }

  #vote-form input:focus + label {
    outline: 2px solid rgba(50, 50, 50, 0.5);
  }

  #vote-form.kb-only td .idontknow input[type="radio"]:checked + label,
  #vote-form.mouseable td:hover .idontknow input[type="radio"]:checked + label,
  #vote-form .focused .idontknow input[type="radio"]:checked + label {
    color: #666;
    background: linear-gradient(to right bottom, #ccc, #fff 24px);
  }

  /* H-scroll btn */
  #results1 .scroll-left,
  #results1 .scroll-right{
    font-size: 200%;
    color: #777;
    top: 0;
    text-decoration: none;
    display: block;
  }

  #results1 .scroll-left {
    left: 150px;
    z-index: 2;
  }

  #results1 .scroll-right {
    right: -30px;
  }

  /* Results icons */
  #results2 td.bg-info span { font-weight: bold }

  #results2 .bg-success i,
  #results2 .bg-warning i,
  #results2 .bg-danger i,
  #results2 td.bg-info span { opacity: 1 }

  .hideYes #results2 .bg-success i,
  .hideInb #results2 .bg-warning i,
  .hideNo #results2 .bg-danger i,
  .hideIdk #results2 td.bg-info span { opacity: 0 }
  .hideInb #results2 .bg-warning {  color: transparent }

  #results2.results tr:hover i,
  #results2.results tr:hover .bg-info span { opacity: 1 }
  #results2.results tr:hover .bg-warning { color: #c05827 }

  /* Legend */
  a[data-target="#hint_modal"] { display: none }

  #hint {
    top: 0px;
    left: 0px;
    z-index: 1000;
  }

  #hint .dropdown-menu {
    min-width: 300px;
    margin-top: 20px;
    margin-left: 20px;
  }

  #hint .btn {
    position: absolute;
    border-radius: 50%;
    width:40px;
    height: 40px;
    z-index: 1001;
    display: inline-block;
    margin: 0;
  }

  #hint ul, #hint p {
    color: #333;
    font-weight: normal;
  }

  #hint .help {
    border-bottom: 1px solid #ffcf4f;
    margin-bottom: 10px;
  }

  #hint .help > p[aria-hidden] { display: none }

  #hint li > span:first-of-type {
    width: 40px;
    text-align: center;
    float: left;
    font-weight: bold
  }

  #hint li > span:last-of-type {
    cursor: pointer;
  }

  .hideYes #hint li.l-yes > span:last-of-type,
  .hideInb #hint li.l-inb > span:last-of-type,
  .hideNo #hint li.l-no > span:last-of-type,
  .hideIdk #hint li.l-idk > span:last-of-type { text-decoration: line-through }

  /* Chart + Comments */
  #showChart button { display: none }

  #chartBtn, #commentsBtn {
    top: 0px;
    border-radius: 50%;
    width:40px;
    height: 40px;
    z-index: 999;
    color: #777;
    display: inline-block;
    margin: 0;
  }

  #chartBtn {
    left: 45px;
  }

  #commentsBtn {
    left: 90px;
    line-height: 0.8;
    white-space: inherit;
  }

  #commentsBtn > span:nth-child(2) {
    font-size: 11px;
  }
`);
    };
    updateTableCSS();
    tableResize = function() {
      let width = jQuery('.container.ombre').width();
      if (jQuery('#results2 tbody tr:eq(0)').length > 0) {
        width = Math.min(width, jQuery('#results2 tbody tr:eq(0)').width());
      } else {
        width = Math.min(width, jQuery('#results1 tbody tr:eq(0)').width());
      }
      jQuery('#results1 thead, #results1 tbody, #results2 tbody, #results2 tfoot').width(width);
    };
    tableResize();
    jQuery(window).on('resize', function() {
      tableResize();
    });

    jQuery('#results2 tbody').on('scroll', function() {
      jQuery('#results1 thead, #results1 tbody, #results2 tfoot').scrollLeft(jQuery(this).scrollLeft());
      jQuery('.focused').removeClass('focused');
    });

    if (!jQuery('.results tbody tr').length) {
      jQuery('.results tbody').hide();
      jQuery('.results tfoot').hide();
    }

    // Empty votes a11y
    jQuery('#vote-form li.hide, #vote-form li[style="display:none"]')
      .addClass('idontknow')
      .removeClass('hide')
      .attr('style', '');
    jQuery('#vote-form .startunchecked').removeClass('startunchecked');
    jQuery('#vote-form .idontknow input').each(function() {
      const id = jQuery(this).attr('id');
      jQuery(this).attr('id', id.replace(/^n/, 'k')); // avoid duplicate id="n-choice-*"
      const t = jQuery(`#${id}`).next('label').attr('title'); // title from "No" button
      let vote = '';

      if (/» /.test(t)) {
        vote = t.split('» ')[1];
      } else if (/" /.test(t)) {
        vote = t.split('" ')[1];
      }
      jQuery(this).after(`
    <label class="btn btn-default btn-xs"
      for="${id.replace(/^n/, 'k')}" title="${/^fr/.test(document.documentElement.lang) ? 'Ne pas se prononcer' : 'Do not vote'} ${vote}">
      ?
      <span class="sr-only">${/^fr/.test(document.documentElement.lang) ? 'Je ne sais pas' : 'I don’t know'}</span>
    </label>
   `);
    });

    jQuery('#vote-form li input').on('focus', function() {
      jQuery('#vote-form .focused').removeClass('focused');
      jQuery(this).parent().parent().parent().addClass('focused');
    });

    // [desktop] Unfocus on mouseout
    jQuery('#vote-form td:not(.focused)').on('mouseover', () => {
      jQuery('.mouseable .focused').removeClass('focused');
    });
    // [mobile] Unfocus the last checkbox menu
    jQuery('#vote-form li input').on('focusout', function() {
      const focused = jQuery(this).parent().parent().parent();
      if (!jQuery('#vote-form').hasClass('kb-only')) {
        setTimeout(function() {
          if (focused.find('input:focus').length === 0) {
            focused.removeClass('focused');
          }
        }, 1000);
      }
    });

    // H-scroll buttons aside thead
    jQuery('#results1 thead th:last')
      .prepend(jQuery('.scroll-buttons .scroll-left'))
      .append(jQuery('.scroll-buttons .scroll-right'));

    jQuery('.scroll-left, .scroll-right')
      .on('click', (event) => {
        const scrollScale = Math.floor(jQuery('#results2').width() * 0.7);
        const currentPos = jQuery('#results2 tbody').scrollLeft();
        const newPos = /scroll-left/.test(event.currentTarget.className)
          ? Math.max(0, currentPos - scrollScale)
          : currentPos + scrollScale;
        jQuery('#results2 tbody').animate({scrollLeft: newPos}, 500);
        event.preventDefault();
      })
    .attr('aria-hidden', 'true');

    scrollBtnStatus = () => {
      const position = jQuery('#results2 tbody').scrollLeft();
      const atLeft = (position === 0);
      const atRight = (position >= jQuery('#results2 tbody tr:eq(0)').width() - jQuery('#results2 tbody').width());
      const scrollbar = jQuery('#results2').width() < jQuery('#results2 tbody tr:eq(0)').width();
      jQuery('.scroll-left')[atLeft ? 'addClass' : 'removeClass']('disabled');
      jQuery('.scroll-right')[atRight ? 'addClass' : 'removeClass']('disabled');
      jQuery('.scroll-left')[!scrollbar ? 'addClass' : 'removeClass']('hidden');
      jQuery('.scroll-right')[!scrollbar ? 'addClass' : 'removeClass']('hidden');
    };
    jQuery('#results2 tbody').on('scroll', () => { scrollBtnStatus() });
    jQuery(window).on('resize', () => { scrollBtnStatus() });
    scrollBtnStatus();

    // Tooltip on ellipsis !
    jQuery('#results1 th[id^="H"], #results1 th[id^="C"]').each(function() {
      jQuery(this).attr('title', jQuery(this).text());
    });

    jQuery('#results2 tbody tr').each(function() {
      // Tooltip on rows
      jQuery(this).attr('title', jQuery(jQuery(this).find('th').contents()[0]).text().replace(/\s*$/g, ''));
    });
    jQuery('.results .btn-sm').addClass('hidden-print');

    // Results icons
    jQuery('#results2 td.bg-info .sr-only')
      .text('?').removeClass('sr-only')
      .after(`<span class="sr-only">${/^fr/.test(document.documentElement.lang) ? 'Je ne sais pas' : 'I don’t know'}</span>`);
    jQuery('#tableContainer').addClass('hideNo hideIdk');

    // Legend + switch icons
    jQuery('#results1 thead th:last').append(`
  <div id="hint" class="dropdown">
    <button class="btn alert-warning dropdown-toggle"
      type="button" id="legend" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="true">
      <i class="fa fa-lg fa-lightbulb-o" aria-hidden="true"></i>
      <span class="sr-only">${jQuery('#hint_modal .modal-title').text()}</span>
    </button>
    <div class="dropdown-menu alert alert-warning" aria-labelledby="legend">
      <div class="help">
        ${jQuery('#hint_modal .modal-body .alert').html()}
      </div>
      <p class="h4" aria-hidden="true">${jQuery('#hint_modal .modal-title').text()}</p>
      <ul class="list-unstyled">
        <li class="l-yes">
          <span class="text-success"><i class="glyphicon glyphicon-ok"></i></span>
          <span onclick="document.getElementById('tableContainer').classList.toggle('hideYes')">
            ${jQuery('#hint_modal p[aria-hidden="true"]').text().split(/(= |, )/)[2]}
          </span>
        </li>
        <li class="l-inb">
          <span class="text-warning">(<i class="glyphicon glyphicon-ok"></i>)</span>
          <span onclick="document.getElementById('tableContainer').classList.toggle('hideInb')">
            ${jQuery('#hint_modal p[aria-hidden="true"]').text().split(/(= |, )/)[6]}
          </span>
        </li>
        <li class="l-no">
          <span class="text-danger"><i class="glyphicon glyphicon-ban-circle"></i></span>
          <span onclick="document.getElementById('tableContainer').classList.toggle('hideNo')">
            ${jQuery('#hint_modal p[aria-hidden="true"]').text().split(/(= |, )/)[10]}
          </span>
        </li>
        <li class="l-idk">
          <span class="text-muted">?</span>
          <span onclick="document.getElementById('tableContainer').classList.toggle('hideIdk')">
            ${/^fr/.test(document.documentElement.lang) ? 'Je ne sais pas' : 'I don’t know'}
          </span>
        </li>
      </ul>
    </div>
  </div>
`);

    /* Chart */
    jQuery('#results1 thead th:last').append(`
  <button id="chartBtn" class="btn btn-default" type="button"
    title="${jQuery('#showChart').text().replace(/^\s*/g, '').replace(/\s*$/g, '')}">
    <i class="fa fa-bar-chart" aria-hidden="true"></i>
    <span class="sr-only">${jQuery('#showChart').text()}</span>
  </button>
`);
    jQuery('#chartBtn').on('click', (event) => {
      jQuery('#showChart').trigger('click');
      jQuery('html, body').animate({
        scrollTop: jQuery('#Chart').offset().top - 60
      }, 2000);
      event.preventDefault();
    });

    /* Comments */
    jQuery('#results1 thead th:last').append(`
  <button id="commentsBtn" class="btn btn-default" type="button"
    title="${jQuery('#comments_list h3').text()}">
    <i class="glyphicon glyphicon-comment" aria-hidden="true"></i>
    <span>${jQuery('#comments_list .comment').length}</span>
    <span class="sr-only">${jQuery('#comments_list h3').text()}</span>
  </button>
`);
    jQuery('#commentsBtn').on('click', (event) => {
      jQuery('html, body').animate({
        scrollTop: jQuery('#comments_list').offset().top
      }, 2000);
      event.preventDefault();
    });
  }

  // Remove trailing spaces
  jQuery('#yourname, #email').focusout(function() {
    jQuery(this).val(function( index, value ) {
      return value.trim();
    });
  });

  // Recap + Save button under #name input
  updateChoicesCount = function() {
    const all = jQuery('.choice').length;
    let yes = 0;
    let inb = 0;
    let no = 0;

    jQuery('.choice input:radio:checked').each(function() {
      if ($(this).val() === '2') { yes += 1; }
      if ($(this).val() === '1') { inb += 1; }
      if ($(this).val() === '0') { no += 1; }
    });

    jQuery('#choicesCount').html([yes + inb + no, '/', all].join(''));

    jQuery('#yinCount').html([
      (yes > 0 ? '<span><i class="glyphicon glyphicon-ok text-success"></i> ' + yes + '</span>'  : ''),
      (no > 0 ? '<span><i class="glyphicon glyphicon-ban-circle text-danger"></i> ' + no + '</span>  '  : ''),
      (inb > 0 ? '<br /><span><span class="text-warning">(<i class="glyphicon glyphicon-ok"></i>)</span> ' + inb + '</span>'  : '')].join(''));
  }

  jQuery('#vote-form #name').parent().after(function() {
    const label = jQuery('#vote-form button[name="save"]').text(); // .attr('title');
    return [
     '<p id="yinCount" aria-hidden="true"></p>',
     '<button id="saveAlt" aria-hidden="true" type="button" class="btn btn-success btn-sm" onclick="document.getElementsByName(\'save\')[0].click()">',
     label,
     ' <span id="choicesCount"></span></button>'
    ].join('');
  });
  updateChoicesCount();

  jQuery('.choice input:radio').on('change', function() {
    updateChoicesCount();
  });
  /* Limit #name and #ValueMax length to avoid 500 */
  jQuery('#name').attr('maxlength', '64');
  jQuery('#ValueMax #ValueMax').attr('max', '127');

  // A11y 
  // Hide glyphicons
  document.querySelectorAll('.glyphicon').forEach(function(icon) {
    icon.setAttribute('aria-hidden', 'true');
  });
  // Title used in label for screen reader
  jQuery('#vote-form label.btn').each(function() {
    jQuery(this).append(`<span class="sr-only">${jQuery(this).attr('title')}</span>`);
  }); 
});
