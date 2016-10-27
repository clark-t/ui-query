/**
 * @file ui-query.js
 * @author clarkt (clarktanglei@163.com)
 */

class EL {
    constructor(elem, root) {
        if (typeof elem === 'string') {
            if (elem.slice(0, 1) === '<' && elem.slice(-1) === '>') {
                var ele = document.createElement('div');
                ele.innerHTML = elem;
                elem = ele.children[0];
            }
            else {
                elem = ($.getDom(root) || document).querySelector(elem);
            }
        }

        this.dom = elem;
        this.computed = getComputedStyle(elem);
        this.style = elem.style;
    }

    parent() {
        return $(this.dom.parentNode);
    }

    attr() {
        if (val == null) {
            return this.dom.getAttribute(name);
        }

        this.dom.setAttribute(name, val);
        return this;
    }

    width(ext) {
        ext = ext ? 'px' : 0;

        if (this.computed.boxSizing) {
            return parseFloat(this.computed.width)
                - parseFloat(this.computed.paddingLeft)
                - parseFloat(this.computed.paddingRight)
                + ext;
        }

        return parseFloat(this.computed.width) + ext;
    }

    height(ext) {
        ext = ext ? 'px' : 0;

        if (this.computed.boxSizing) {
            return parseFloat(this.computed.height)
                - parseFloat(this.computed.paddingTop)
                - parseFloat(this.computed.paddingBottom)
                + ext;
        }

        return parseFloat(this.computed.height) + ext;
    }

    size(ext) {
        return {
            width: this.width(ext),
            height: this.height(ext)
        };
    }

    outerWidth(ext) {
        ext = ext ? 'px' : 0;
        return this.dom.clientWidth
            + parseFloat(this.computed.borderLeft)
            + parseFloat(this.computed.borderRight)
            + ext;
    }

    outerHeight(ext) {
        ext = ext ? 'px' : 0;
        return this.dom.clientHeight
            + parseFloat(this.computed.borderTop)
            + parseFloat(this.computed.borderBottom)
            + ext;
    }

    outerSize(ext) {
        return {
            width: this.outerWidth(ext),
            height: this.outerHeight(ext)
        };
    }

    css(name, val) {
        switch ($.instance(name)) {
            case 'String':
                if (val == null) {
                    return this.computed[name];
                }

                this.style[name] = val;
                return this;

            case 'Array':
                if (val === 'remove') {
                    return this.removeStyle(name);
                }

                return this.getStyle(name);

            default:
                return this.setStyle(name);
        }
    }

    setStyle(val) {
        var styleObj = $.parse(this.attr('style') || '');
        styleObj = Object.keys(val)
            .reduce((res, key) => {
                res[key] = val[key];
                return res;
            }, styleObj);

        this.attr('style', $.stringify(styleObj));
        return this;
    }

    getStyle(val) {
        return val.reduce((res, name) => {
            res[name] = this.computed[name];
            return res;
        }, {});
    }

    removeStyle(exclude) {
        exclude = typeof exclude === 'string' ? [exclude] : exclude;
        var styleObj = $.parse(this.attr('style') || '');
        var styleStr = Object.keys(styleObj)
            .filter(key => exclude.indexOf(key) === -1)
            .reduce((res, key) => `${res}${key}:${styleObj[key]};`, '');

        this.attr('style', styleStr);
        return this;
    }

    addClass(val) {
        this.dom.className = val.trim()
            .split(' ')
            .reduce((res, name) => res.indexOf(name) > -1 ? res : `${res} ${name}`,
                this.dom.className.trim()
            );
        return this;
    }

    removeClass(val) {
        var classText = ` ${this.dom.className} `;

        if (/^ *$/.test(classText)) {
            return this;
        }

        this.dom.className = val.split(' ')
            .reduce((res, name) => res.replace(` ${name} `, ' '), classText)
            .trim();

        return this;
    }

    insertAfter(elem) {
        elem = $.getDom(elem);
        var parent = elem.parentNode;

        if (parent.lastChild === elem) {
            parent.appendChild(this.dom);
        }
        else {
            parent.insertBefore(this.dom, elem.nextSibling);
        }

        return this;
    }

    append(elem) {
        elem = $.getDom(elem);
        this.dom.appendChild(elem);
        return this;
    }

    replaceWith(elem) {
        elem = $.getDom(elem);
        var parent = this.dom.parentNode;
        parent.replaceChild(elem, this.dom);
        return this;
    }

    on(types, callback) {
        (Array.isArray(types) ? types : types.split(' '))
            .forEach(type => this.dom.addEventListener(type, callback));
        return this;
    }
}

function $(elem, root) {
    return elem instanceof EL
        ? elem
        : new EL(elem, root);
}

$.stringify = styleObject => Object.keys(styleObject)
    .filter(key => !key || styleObject[key] != null)
    .reduce((res, key) => `${res}${$.dasherize(key)}:${styleObject[key]};`, '');

$.parse = styleString => styleString.trim()
    .replace(/ *(;|:) */g, '$1')
    .replace(/;$/, '')
    .split(';')
    .filter(style => !!style)
    .reduce((res, style) => {
        style = style.split(':');
        res[style[0]] = style[1];
        return res;
    }, {});


$.dasherize = str => str.replace(/::/g, '/')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/_/g, '-')
    .toLowerCase();

$.prefix = (name, value) => ['', '-webkit-']
    .reduce((res, prefix) => {
        res[prefix + name] = value;
        return res;
    }, {});

$.inverse = style => ` ${style}`
    .replace(/( +)(\D?)(\d+)/g, (s, s1, s2, s3) => `${s1}${s2 === '-' ? '+' : '-'}${s3}`)
    .replace(/^ /, '');

$.extend = (...objs) => objs[0] == null
    ? objs[0]
    : objs.reduce((res, ext) => ext == null
        ? res
        : Object.keys(ext)
            .reduce((res, key) => {
                res[key] = ext[key];
                return res;
            }, res)
    );

$.instance = val => Object.prototype.toString.call(val).slice(8, -1);

$.getDom = elem => elem instanceof EL ? elem.dom : elem;

module.exports = $;
