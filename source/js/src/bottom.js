
  });

}( jQuery ));

$(document).ready(function () {	
	var $summarypay = $('#summary-pay');	
	var $summarypercent = $('#summary-percent');	
	var priceformatRegex = new RegExp("(\\d)(?=(\\d\\d\\d)+([^\\d]|$))", 'g');	
	var sliderData = {	
		currentPay: 0,	
		currentPercent: 0	
	};	
	$('.js-calc-slider').each(function () {	
		var sliderName = this.getAttribute('data-name');	
		sliderData[sliderName] = {	
			$slider: $(this),	
			$input: $('#calc-' + sliderName + '__result'),	
			defaultValue: this.getAttribute('data-default')	
		};	
		sliderData[sliderName].$slider.slider({	
			animate: "slow",	
			range: "min",	
			slide : onChangeSlider,	
			change: onChangeSlider	
		});	
		sliderData[sliderName].$input.on('change', function () {	
			var output = parseInt(this.value.replace(/\s/g, ''));	
			sliderData[sliderName].$slider.slider("value", isNaN(output) ? parseInt(sliderData[sliderName].defaultValue.replace(/\s/g, '')) : output);	
		});	
		function onChangeSlider (event, ui) {	
			sliderData[sliderName].$input.val(sliderName === 'price' ? getResult(ui.value) : ui.value);	
			sliderData.currentPay = calculator.getPaymentWithInitial(	
				sliderName === 'initial' ? ui.value : sliderData.initial.$slider.slider('value'),	
				sliderName === 'price' ? ui.value : sliderData.price.$slider.slider('value'),	
				sliderName === 'time' ? ui.value : sliderData.time.$slider.slider('value'),	
				sliderData.currentPercent);	
			printPay();	
		}	
	});	
	sliderData.price.$slider.slider('option', {	
		value: 1000000,	
		min: 1000000,	
		max: 200000000	
	});	
	sliderData.price.$input.val(getResult(sliderData.price.$slider.slider('value')));	
	sliderData.time.$slider.slider('option', {	
		value: 30	
	});	
	$('.js-bank').on('change', function () {	
		var percent = this.getAttribute('data-percent');	
		var initial = parseFloat(this.getAttribute('data-initial'));	
		var time = this.getAttribute('data-time').split(';');	
		sliderData.time.$slider.slider('option', {	
			min: parseFloat(time[0]),	
			max: parseFloat(time[1])	
		});	
		sliderData.time.$input.val(sliderData.time.$slider.slider('value'));	
		sliderData.initial.$slider.slider('option', {	
			min: initial,	
			max: 95	
		});	
		sliderData.initial.$input.val(sliderData.initial.$slider.slider('value'));	
		$summarypercent[0].innerHTML = percent;	
		sliderData.currentPercent = parseFloat(percent);	
		sliderData.currentPay = calculator.getPaymentWithInitial(	
			sliderData.initial.$slider.slider('value'),	
			sliderData.price.$slider.slider('value'),	
			sliderData.time.$slider.slider('value'),	
			sliderData.currentPercent);	
		printPay();	
	}).eq(0).prop('checked', true).trigger('change');	
	function printPay() {	
		$summarypay[0].innerHTML = sliderData.currentPay.toString().replace(priceformatRegex, '$1 ');	
	}	
	function getResult(val) {	
		return val.toString().replace(priceformatRegex, '$1 ');	
	}	
});	
var calculator = (function() {	
	var module = {};	
	/**	
	 * Вычисление логарифма с произвольным основанием	
	 * @param {float} x - основание логарифма	
	 * @param {float} y - число, от которого требуется найти логарифм	
	 * @return {float}	
	 */	
	function getBaseLog(x, y) {	
		return Math.log(y) / Math.log(x);	
	}
	/**	
	 * Вычисляет ежемесячный платёж по сроку ипотеки	
	 *	
	 * @param sum - сумма кредита	
	 * @param period - срок в годах	
	 * @param rate - годовая ставка в процентах	
	 * @return integer или Nan	
	 */	
	module.getPayment = function(sum, period, rate) {	
		var i,	
			koef,	
			result;	
		// ставка в месяц	
		i = (rate / 12) / 100;	
		// коэффициент аннуитета	
		koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);	
		// итог	
		result = sum * koef;	
		// округлим до целых	
		return result.toFixed();	
	};	
	/**	
	 * Декоратор для учета первого взноса	
	 *	
	 * @param initial_percent - первоначальный взнос в процентах	
	 * @param sum - сумма кредита	
	 * @param period - срок в годах	
	 * @param rate - годовая ставка в процентах	
	 * @return integer или Nan	
	 */	
	module.getPaymentWithInitial = function (initial_percent, sum, period, rate) {	
		var sum_without_initial = sum - (sum/100 * initial_percent);	
		return this.getPayment(sum_without_initial, period, rate);	
	};	
	/**	
	 * Вычисляет период выплаты ипотеки по ежемесячному платежу	
	 *	
	 * @param sum - сумма кредита	
	 * @param plat - ежемясячный платеж	
	 * @param rate - годовая ставка в процентах	
	 * @return или Nan	
	 */	
	module.getPeriod = function(sum, plat, rate) {	
		var mm,	
			i,	
			result;	
		// ставка в месяц	
		i = (rate / 12) / 100;	
		mm = plat / sum;	
		result = getBaseLog(1 + i, -mm / (i - mm));	
		// округлим до целых	
		return Math.ceil(+result);	
	};	
	return module;	
})();