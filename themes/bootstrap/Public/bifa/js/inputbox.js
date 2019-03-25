/**
 * jQuery InputBox - A Custom Select/Checkbox/Radio Plugin
 * ------------------------------------------------------------------
 *
 * jQuery InputBox is a plugin for custom Select/Checkbox/Radio Plugin.
 *
 * @version        1.0.0
 * @since          2013.09.23
 * @author         charles.yu
 *
 * ------------------------------------------------------------------
 *
 *  eg:
 *	1銆丼elect
 *  //class: selected 琛ㄧず榛樿閫変腑,濡傛湁澶氫釜selected榛樿閫変腑绗竴涓�
 *  <div name="city" type="selectbox">
 *		<div class="opts">
 *			<a href="javascript:;" value="050101">鑻忓窞</a>
 *			<a href="javascript:;" value="050101" class="selected">鏃犻敗</a>
 *			<a href="javascript:;" value="050101" class="selected">甯稿窞</a>
 *		</div>
 *	</div>
 *  $('div[name="city"]').inputbox();
 *
 *	2銆丆heckbox
 *	//class: all 琛ㄧず鏄叏閫墊鍏ㄤ笉閫夋寜閽紝濡傛灉鏄叏閫夋寜閽紝鍒欏叾"name"涓烘帶鍒跺璞＄殑"name+All"; checked 琛ㄧず榛樿閫変腑
 *	<div class="cbt all" name="checkAll" type="checkbox"></div>
 *  <div class="cbt" class="checked" name="check"  type="checkbox" value="1" ></div>
 *	<div class="cbt" name="check"  type="checkbox" value="2" ></div>
 *	<div class="cbt" name="check"  type="checkbox" value="3"></div>
 *  $('.cbt').inputbox();
 *
 *	3銆丷adio
 *  //class: checked 琛ㄧず榛樿閫変腑锛屽鏈夊涓猻elected榛樿閫変腑鏈€鍚庝竴涓�
 *	<div name="rbt checked" type="radiobox" val="cn"></div><span>涓枃</span>
 *	<div name="rbt" type="radiobox" val="en"></div><span>鑻辨枃</span>
 *	$('div[name="rbt"]').inputbox();
 */
;
(function($) {
	var opts = {};

	var selectbox = {
		//鍒濆鍖栬嚜瀹氫箟selectbox
		init: function(o) {
			var $o = $(o),
				_name = $o.attr('name'),
				_selectValue = $o.find('.opts > a.selected').attr('value') ? $o.find('.opts > a.selected').attr('value') : $o.find('.opts > a:first').attr('value'),
				_selectHtml = $o.find('.opts > a.selected').html() ? $o.find('.opts > a.selected').html() : $o.find('.opts > a:first').html();
			console.log(_selectValue);
			$o.addClass('sb');
			$o.append($('<div class="sb_icon arrow" />')).append($('<input type="hidden" name="' + _name + '" value="' + _selectValue + '">'));
			$('<div class="selected">' + _selectHtml + '</div>').insertBefore($o.children(':first'));

			$o.children('.opts').show();
			var optsWidth = $o.children('.opts').width();

			if (optsWidth == 0) {
				var optsChildWidth = [];
				var tempWidth = 0;
				$o.children('.opts').children('a').each(function() {
					optsChildWidth.push($(this).width());
				});
				for (var i = 0; i < optsChildWidth.length; i++) {
					if (optsChildWidth[i] > tempWidth)
						tempWidth = optsChildWidth[i]
				}
				optsWidth = tempWidth + 10;
			}
			$o.children('.opts').hide();
			$o.children('.opts').css('width', (optsWidth + 15));

			var _width = (opts.width != 'auto') ? opts.width : $o.children('.opts').width();

			$o.css({
				'width': _width,
				'height': opts.height
			}).find('div.selected').css({
				'height': opts.height,
				'line-height': opts.height + 'px'
			});
			$o.find('.sb_icon').css({
				'top': ($o.height() - $o.find('.sb_icon').height()) / 2
			});

			$o.click(selectbox.toggle);
			$o.find('.opts > a').click(selectbox.select).hover(selectbox.hover);
			$(document).click(selectbox.hide);
		},
		toggle: function(e) {
			e.stopPropagation();
			var $o = $(this);
			var $opts = $o.children('.opts');
			$o.find('a.selected').removeClass('none');
			selectbox.hide(null, $('.sb').not($o));
			$o.toggleClass('sb_active');
			$opts.css({
				'width': Math.max($opts.width(), $o.width()),
				'top': $o.height(),
				'left': -parseInt($o.css('border-left-width'))
			}).toggle($o.hasClass('sb_active'));
		},
		hide: function(e, objs) {
			var $o = objs ? objs : $('.sb');
			if(!objs){//淇閫夋嫨妗嗛潪jquery瀵硅薄鎶ラ敊闂
				$o.removeClass('sb_active').children('.opts').hide().find('a.selected').removeClass('none');
			}
		},
		select: function(e) {
			e.stopPropagation();
			var $o = $(this).parents('.sb:first');
			selectbox.hide();
			$o.find('a.selected').removeClass('selected');
			$(this).addClass('selected');
			$o.find('div.selected').html($(this).html());
			$o.find('input').val($(this).attr('value'));
			//鍙栧€煎嚱鏁�
			selectBoxChange($(this));
		},
		hover: function(e) {
			e.stopPropagation();
			var $o = $(this).parents('.sb:first');
			$o.find('a.selected').addClass('none');
		}
	};

	var checkbox = {
		//鍒濆鍖朿heckbox
		init: function(o) {
			var $o = $(o),
				_name = $o.attr('name'),
				_value = $o.attr('val') ? $o.attr('val') : '',
				_isChecked = $o.hasClass('checked') ? true : false;

			$o.addClass('cb');
			$('<input type="checkbox" name="' + _name + '" value="' + _value + '" style="display:none"/>').appendTo(o).click(function(e){e.stopPropagation()});
			$o.click(checkbox.toggle);
			if ($o.hasClass('all')) $o.click(checkbox.allOrNone);
			if (_isChecked) {
				$o.removeClass('checked');
				$o.click();
			}
		},
		toggle: function(e) {
			$(this).toggleClass('checked').children().attr('checked', !$(this).hasClass('checked'));
		},
		allOrNone: function(e) {
			var cbAllName = $(this).attr('name');
			if (cbAllName.length > 3) {
				var cbOneName = cbAllName.substring(0, cbAllName.length - 3);
				var isChecked = $(this).hasClass('checked') ? true : false;
				if (isChecked) {
					$('.cb[name=' + cbOneName + ']').not($('.checked[name=' + cbOneName + ']')).click();
				} else {
					$('.checked[name=' + cbOneName + ']').click();
				}
			}
		}
	};

	var radiobox = {
		//鍒濆鍖杛adiobox
		init: function(o) {
			var $o = $(o),
				_name = $o.attr('name'),
				_value = $o.attr('val') ? $o.attr('val') : '';
			_isChecked = $o.hasClass('checked') ? true : false;

			$o.addClass('rb');
			$('<input style="display:none" type="radio" name="' + _name + '" value="' + _value + '" />').appendTo(o).click(function(e){e.stopPropagation()});
			$o.click(radiobox.toggle);
			if (_isChecked) {
				$o.removeClass('checked');
				$o.click();
			}
		},
		toggle: function() {
			var $o = $(this),
				_name = $o.attr('name');
			$('[name="' + _name + '"]').removeClass('rb_active').children().attr('checked', false);
			$o.addClass('rb_active').children().attr('checked', true);
		}
	},

		_init = function(o) {
			var type = $(o).attr('type');
			if (type == 'selectbox') {
				selectbox.init(o);
			} else if (type == 'checkbox') {
				checkbox.init(o);
			} else if (type == 'radiobox') {
				radiobox.init(o);
			}
		};

	$.fn.inputbox = function(options) {
		opts = $.extend({}, $.fn.inputbox.defaults, options);

		return this.each(function() {
			_init(this);
		});
	};

	$.fn.inputbox.defaults = {
		//type: 'selectbox',//selectbox|checkbox|radiobox
		width: 'auto',
		height: 24
	};
})(jQuery);