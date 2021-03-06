// Generated by CoffeeScript 1.10.0
var Contact, DataPoint, PREFIX, async, cozydb, fs, log,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

cozydb = require('cozydb');

async = require('async');

fs = require('fs');

log = require('printit')({
  prefix: 'Contact Model'
});

DataPoint = (function(superClass) {
  extend(DataPoint, superClass);

  function DataPoint() {
    return DataPoint.__super__.constructor.apply(this, arguments);
  }

  DataPoint.schema = {
    name: String,
    value: cozydb.NoSchema,
    pref: Boolean,
    type: String
  };

  return DataPoint;

})(cozydb.Model);

module.exports = Contact = (function(superClass) {
  extend(Contact, superClass);

  function Contact() {
    return Contact.__super__.constructor.apply(this, arguments);
  }

  Contact.docType = 'contact';

  Contact.schema = {
    id: String,
    fn: String,
    n: String,
    org: String,
    title: String,
    department: String,
    bday: String,
    nickname: String,
    url: String,
    revision: Date,
    datapoints: [DataPoint],
    note: String,
    tags: [String],
    binary: Object,
    _attachments: Object
  };

  Contact.cast = function(attributes, target) {
    target = Contact.__super__.constructor.cast.call(this, attributes, target);
    return target;
  };

  return Contact;

})(cozydb.CozyModel);

Contact.prototype.updateAttributes = function(changes, callback) {
  changes.revision = new Date().toISOString();
  return Contact.__super__.updateAttributes.apply(this, arguments);
};

Contact.prototype.save = function(callback) {
  this.revision = new Date().toISOString();
  return Contact.__super__.save.apply(this, arguments);
};

PREFIX = 'http://schemas.google.com/g/2005#';

Contact.fromGoogleContact = function(gContact) {
  var adr, contact, email, ev, getTypeFragment, getTypePlain, i, im, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, o, phone, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref3, ref4, ref5, ref6, ref7, ref8, ref9, rel, web;
  if (gContact == null) {
    return;
  }
  contact = {
    fn: (ref = gContact.gd$name) != null ? (ref1 = ref.gd$fullName) != null ? ref1.$t : void 0 : void 0,
    n: (((ref2 = gContact.gd$name) != null ? (ref3 = ref2.gd$familyName) != null ? ref3.$t : void 0 : void 0) || '') + ";" + (((ref4 = gContact.gd$name) != null ? (ref5 = ref4.gd$givenName) != null ? ref5.$t : void 0 : void 0) || '') + ";" + (((ref6 = gContact.gd$name) != null ? (ref7 = ref6.gd$additionalName) != null ? ref7.$t : void 0 : void 0) || '') + ";" + (((ref8 = gContact.gd$name) != null ? (ref9 = ref8.gd$namePrefix) != null ? ref9.$t : void 0 : void 0) || '') + ";" + (((ref10 = gContact.gd$name) != null ? (ref11 = ref10.gd$nameSuffix) != null ? ref11.$t : void 0 : void 0) || ''),
    org: gContact != null ? (ref12 = gContact.gd$organization) != null ? (ref13 = ref12.gd$orgName) != null ? ref13.$t : void 0 : void 0 : void 0,
    title: gContact != null ? (ref14 = gContact.gd$organization) != null ? (ref15 = ref14.gd$orgTitle) != null ? ref15.$t : void 0 : void 0 : void 0,
    bday: (ref16 = gContact.gContact$birthday) != null ? ref16.when : void 0,
    nickname: (ref17 = gContact.gContact$nickname) != null ? ref17.$t : void 0,
    note: (ref18 = gContact.content) != null ? ref18.$t : void 0
  };
  getTypeFragment = function(component) {
    var ref19;
    return ((ref19 = component.rel) != null ? ref19.split('#')[1] : void 0) || component.label || 'other';
  };
  getTypePlain = function(component) {
    return component.rel || component.label || 'other';
  };
  contact.datapoints = [];
  ref19 = gContact.gd$email || [];
  for (i = 0, len = ref19.length; i < len; i++) {
    email = ref19[i];
    contact.datapoints.push({
      name: "email",
      pref: email.primary || false,
      value: email.address,
      type: getTypeFragment(email)
    });
  }
  ref20 = gContact.gd$phoneNumber || [];
  for (j = 0, len1 = ref20.length; j < len1; j++) {
    phone = ref20[j];
    contact.datapoints.push({
      name: "tel",
      pref: phone.primary || false,
      value: (ref21 = phone.uri) != null ? ref21.replace('tel:', '') : void 0,
      type: getTypeFragment(phone)
    });
  }
  ref22 = gContact.gd$im || [];
  for (k = 0, len2 = ref22.length; k < len2; k++) {
    im = ref22[k];
    contact.datapoints.push({
      name: "chat",
      value: im.address,
      type: ((ref23 = im.protocol) != null ? ref23.split('#')[1] : void 0) || 'other'
    });
  }
  ref24 = gContact.gd$structuredPostalAddress || [];
  for (l = 0, len3 = ref24.length; l < len3; l++) {
    adr = ref24[l];
    contact.datapoints.push({
      name: "adr",
      value: ["", "", (ref25 = adr.gd$formattedAddress) != null ? ref25.$t : void 0, "", "", "", ""],
      type: getTypeFragment(adr)
    });
  }
  ref26 = gContact.gContact$website || [];
  for (m = 0, len4 = ref26.length; m < len4; m++) {
    web = ref26[m];
    contact.datapoints.push({
      name: "url",
      value: web.href,
      type: getTypePlain(web)
    });
  }
  ref27 = gContact.gContact$relation || [];
  for (n = 0, len5 = ref27.length; n < len5; n++) {
    rel = ref27[n];
    contact.datapoints.push({
      name: "relation",
      value: rel.$t,
      type: getTypePlain(rel)
    });
  }
  ref28 = gContact.gContact$event || [];
  for (o = 0, len6 = ref28.length; o < len6; o++) {
    ev = ref28[o];
    contact.datapoints.push({
      name: "about",
      value: (ref29 = ev.gd$when) != null ? ref29.startTime : void 0,
      type: getTypePlain(ev)
    });
  }
  return contact;
};

Contact.prototype.getName = function() {
  var dp, i, len, name, ref;
  name = '';
  if ((this.fn != null) && this.fn.length > 0) {
    name = this.fn;
  } else if (this.n && this.n.length > 0) {
    name = this.n.split(';').join(' ').trim();
  } else {
    ref = this.datapoints;
    for (i = 0, len = ref.length; i < len; i++) {
      dp = ref[i];
      if (dp.name === 'email') {
        name = dp.value;
      }
    }
  }
  return name;
};

Contact.all = function(callback) {
  return Contact.request('all', callback);
};
