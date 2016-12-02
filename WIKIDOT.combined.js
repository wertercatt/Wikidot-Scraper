var WIKIDOT = {};
var WIKIDOT = {
	page: function () {},
	modules: function () {},
	utils: function () {},
	vars: function () {}
};
WIKIDOT.utils = {
	changeTextareaRowNo: function (b, d) {
		var c = $(b);
		if ((d < 0 && c.rows + d >= 5) || (d > 0 && c.rows + d <= 50)) {
			c.rows = c.rows + d
		}
	}
};
WIKIDOT.captcha = {
	reloadMathCaptcha: function (b) {
		p = new Object();
		p.action = "CaptchaAction";
		p.event = "reloadMathCaptcha";
		OZONE.ajax.requestModule(null, p, function (c) {
			if (c.name) {
				var d = $j(b.target).parents(".math-captcha");
				$j("img.captcha-image", d).attr("src", "/local--mathcaptcha/" + c.name);
				$j("input[name=mathCaptchaName]", d).val(c.name);
				$j("input[name=mathCaptchaResult]", d).val("")
			}
		})
	}
};
WIKIDOT.visuals = {
	showCenterMessage: function (c) {
		var b = document.getElementsByTagName("body").item(0);
		sDiv = document.createElement("div");
		sDiv.id = "center-message-shader";
		bodyHeigh = b.offsetHeight + 50;
		viewportHeight = YAHOO.util.Dom.getClientHeight();
		height = Math.max(bodyHeigh, viewportHeight);
		sDiv.style.height = height + "px";
		mTable = document.createElement("table");
		mTable.id = "center-message-wrapper";
		mRow = document.createElement("tr");
		mTd = document.createElement("td");
		mRow.appendChild(mTd);
		mTable.appendChild(mRow);
		mDiv = document.createElement("div");
		mDiv.id = "center-message";
		mTd.appendChild(mDiv);
		$j(mDiv).html(c);
		sDiv.style.visibility = "hidden";
		mTable.style.visibility = "hidden";
		b.appendChild(sDiv);
		b.appendChild(mTable);
		YAHOO.util.Dom.setY("center-message-wrapper", OZONE.visuals.scrollOffsetY());
		mTable.style.height = viewportHeight + "px";
		ofx = new fx.Opacity("center-message", {
				duration: 100
			});
		ofx.setOpacity(0);
		sDiv.style.visibility = "visible";
		mTable.style.visibility = "visible";
		ofx.custom(0, 1)
	},
	changeCenterMessage: function (b) {
		ofx = new fx.Opacity("center-message", {
				duration: 100
			});
		ofx.custom(1, 0);
		setTimeout('OZONE.utils.setInnerHTMLContent("center-message", "' + b + '");ofx.custom(0,1)', 200)
	},
	hideCenterMessage: function () {
		var b = document.getElementsByTagName("body").item(0);
		sDiv = document.getElementById("center-message-shader");
		mTable = document.getElementById("center-message-wrapper");
		if (sDiv != null) {
			b.removeChild(sDiv);
			b.removeChild(mTable)
		}
	}
};
WIKIDOT.utils.handleError = function (c) {
	if (c.status != "ok") {
		var b = new OZONE.dialogs.ErrorDialog();
		if (c.status == "no_permission") {
			b.title = ogettext("Permission error")
		}
		b.content = "<h1>" + ogettext("Please note:") + "</h1><p>" + c.message + "</p>";
		b.show();
		return false
	} else {
		return true
	}
};
WIKIDOT.utils.handleErrorBootstrap = function (d, c, b) {
	if (!b) {
		var b = $j(".error-block")
	}
	b.hide();
	if (d.status != "ok") {
		b.find(".error-block-message").html("<p>" + d.message + "</p>");
		b.show();
		OZONE.visuals.scrollTo("header");
		c.modal("hide");
		return false
	} else {
		return true
	}
};
WIKIDOT.render = {};
WIKIDOT.render.printuser = function (c, g, f) {
	var e = 'href="javascript:;" onclick="WIKIDOT.page.listeners.userInfo(' + c + ')"';
	var b = '<span class="printuser avatarhover">';
	var d = window.location.protocol;
	if (f == true) {
		b += "<a " + e + ' ><img class="small" src="' + d + "//" + URL_HOST + "/avatar.php?userid=" + c + "&amp;size=small&amp;&timestamp=" + new Date().getTime() + '" alt="" style="background-image:url(' + d + "//" + URL_HOST + "/userkarma.php?u=" + c + ')"/>'
	}
	b += "<a " + e + ">" + g + "</a></span>";
	return b
};
WIKIDOT.render.fixAvatarHover = function (b) {
	$j(b).children("a").children("img").first().each(function () {
		a = $j(this).parent();
		YAHOO.util.Event.addListener(a, "mouseover", WIKIDOT.render.fixAvatarHover.showHover)
	})
};
WIKIDOT.render.fixAvatarHover.showHover = function (m) {
	if ($("avatar-hover-container") == null) {
		var s = document.createElement("div");
		s.style.visibility = "hidden";
		s.style.position = "absolute";
		s.style.width = "100%";
		document.getElementsByTagName("body")[0].appendChild(s)
	} else {
		s = $("avatar-hover-container")
	}
	if (this.hoverAvatar == null) {
		var j = this.getElementsByTagName("img")[0];
		var r = j.src.replace(/small/, "normal");
		r = r.replace(/16$/, "48");
		var o = document.createElement("a");
		var k = document.createElement("img");
		k.src = r;
		o.className = "avatar-hover";
		o.style.position = "absolute";
		o.style.display = "none";
		o.href = this.href;
		o.onclick = this.onclick;
		var n = document.createElement("div");
		n.appendChild(k);
		o.appendChild(n);
		YAHOO.util.Dom.generateId(o);
		this.hoverAvatar = o;
		s.appendChild(o);
		YAHOO.util.Event.addListener(o, "mouseout", WIKIDOT.render.fixAvatarHover.hideHover);
		YAHOO.util.Event.addListener(o, "mousemove", WIKIDOT.render.fixAvatarHover.mousemove);
		var b = new fx.Opacity(o, {
				duration: 200
			});
		this.hoverAvatarEffect = b;
		b.setOpacity(0)
	}
	var l = this.hoverAvatar;
	var h,
	g;
	h = YAHOO.util.Dom.getX(this) + 8 + 8;
	g = YAHOO.util.Dom.getY(this) + 8;
	l.style.display = "block";
	var k = l.getElementsByTagName("img")[0];
	var q,
	f;
	var c = false;
	if (k.height == 0) {
		q = 48;
		f = 48;
		c = true;
		YAHOO.util.Event.addListener(k, "load", function (t, d) {
			var e = this;
			YAHOO.util.Dom.setXY(d, [h - (e.width / 2 + 8), g - (e.height / 2 + 8)])
		}, l)
	} else {
		q = k.height;
		f = k.width
	}
	YAHOO.util.Dom.setXY(l, [h - (f / 2 + 8), g - (q / 2 + 8)]);
	if (l.style.opacity == 0) {
		this.hoverAvatarEffect.custom(0, 1)
	}
	l.lastAccess = (new Date()).getTime();
	setTimeout('WIKIDOT.render.fixAvatarHover.mousemove.autoHide("' + l.id + '")', 1000)
};
WIKIDOT.render.fixAvatarHover.hideHover = function (c) {
	var b = YAHOO.util.Event.getRelatedTarget(c);
	if (!YAHOO.util.Dom.isAncestor(this, b) && b != this) {
		this.style.display = "none";
		this.style.visibility = "hidden";
		this.style.opacity = 0
	}
};
WIKIDOT.render.fixAvatarHover.mousemove = function (b) {
	this.lastAccess = (new Date()).getTime()
};
WIKIDOT.render.fixAvatarHover.mousemove.autoHide = function (d) {
	var b = $(d);
	var c = (new Date()).getTime();
	if (b.lastAccess + 3000 < c) {
		b.style.display = "none";
		b.style.visibility = "hidden";
		b.style.opacity = 0
	} else {
		setTimeout('WIKIDOT.render.fixAvatarHover.mousemove.autoHide("' + b.id + '")', 1000)
	}
};
WIKIDOT.page.vars = {};
WIKIDOT.page.vars = {
	forceLockFlag: false,
	draft: false,
	draftText: false,
	draftTitle: false,
	draftDateLastSaved: false
};
WIKIDOT.page.listeners = {
	editClick: function (g) {
		var c = WIKIREQUEST.info.pageId;
		if ($("np-text")) {
			if ($("np-text").value != "") {
				var b = new OZONE.dialogs.ErrorDialog();
				b.content = 'You have an active editor somewhere already and it is not possible to edit multiple elements at once.<br/><br/>(<a href="javascript:;" onclick="OZONE.visuals.scrollTo(\'' + WIKIDOT.Editor.editElementId + "');OZONE.dialog.cleanAll()\">scroll to active editor</a>)";
				b.show();
				return
			} else {
				var d = $("new-post-form-container");
				d.parentNode.removeChild(d);
				if ($("new-post-button")) {
					$("new-post-button").style.display = ""
				}
				WIKIDOT.Editor.shutDown()
			}
		}
		if (c != null) {
			var f = new Object();
			f.page_id = c;
			f.mode = "page";
			f.wiki_page = WIKIREQUEST.info.requestPageName
		} else {
			WIKIDOT.page.vars.newPage = true;
			var f = new Object();
			f.mode = "page";
			f.wiki_page = WIKIREQUEST.info.requestPageName
		}
		if (WIKIDOT.page.vars.forceLockFlag == true) {
			WIKIDOT.page.vars.forceLockFlag = false;
			f.force_lock = "yes"
		}
		OZONE.ajax.requestModule("edit/PageEditModule", f, WIKIDOT.page.callbacks.editClick)
	},
	append: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		b.mode = "append";
		OZONE.ajax.requestModule("edit/PageEditModule", b, WIKIDOT.page.callbacks.editClick)
	},
	editSection: function (d) {
		var b = this.id.replace(/edit\-section\-b\-/, "");
		var c = new Object();
		c.page_id = WIKIREQUEST.info.pageId;
		c.mode = "section";
		c.section = b;
		OZONE.ajax.requestModule("edit/PageEditModule", c, WIKIDOT.page.callbacks.editClick)
	},
	historyClick: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("history/PageHistoryModule", b, WIKIDOT.page.callbacks.historyClick)
	},
	filesClick: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("files/PageFilesModule", b, WIKIDOT.page.callbacks.filesClick)
	},
	blockClick: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("pageblock/PageBlockModule", b, WIKIDOT.page.callbacks.blockClick)
	},
	moreOptionsClick: function (c) {
		if (!$("page-options-bottom")) {
			return
		}
		var b = new fx.Opacity("page-options-bottom-2", {
				duration: 200
			});
		b.setOpacity(0);
		$("page-options-bottom-2").style.display = "block";
		b.custom(0, 1);
		$j("#more-options-button").html($("more-options-button").innerHTML.replace(/\+/, "-"));
		YAHOO.util.Event.removeListener("more-options-button", "click", WIKIDOT.page.listeners.moreOptionsClick);
		YAHOO.util.Event.addListener("more-options-button", "click", WIKIDOT.page.listeners.lessOptionsClick);
		OZONE.visuals.scrollTo("page-options-bottom")
	},
	lessOptionsClick: function (c) {
		if (!$("page-options-bottom-2")) {
			return
		}
		var b = new fx.Opacity("page-options-bottom-2", {
				duration: 200
			});
		b.custom(1, 0);
		setTimeout('document.getElementById("page-options-bottom-2").style.display="none"', 200);
		$j("#more-options-button").html($("more-options-button").innerHTML.replace(/\-/, "+"));
		YAHOO.util.Event.removeListener("more-options-button", "click", WIKIDOT.page.listeners.lessOptionsClick);
		YAHOO.util.Event.addListener("more-options-button", "click", WIKIDOT.page.listeners.moreOptionsClick)
	},
	logoutClick: function (c) {
		var b = new Object();
		b.action = "Login2Action";
		b.event = "logout";
		b.href = window.location.href;
		OZONE.ajax.requestModule(null, b, WIKIDOT.page.callbacks.logoutClick)
	},
	loginClick: function (j, b, k) {
		var h = b || WIKIREQUEST.info.siteId;
		var g = USE_SSL ? "https" : "http";
		var f = g + "://" + URL_HOST + "/default--flow/login__LoginPopupScreen?originSiteId=" + h;
		var d = window.location;
		f += "&openerUri=" + d.protocol + "//" + d.host;
		if (k) {
			f += "&invitationHash=" + k
		}
		var c = window.open(f, "login", "width=700,height=640,resizable=yes,directories=no,status=yes,menubar=yes,location=yes,scrollbars=yes");
		c.focus()
	},
	createAccount: function (h, c, j) {
		var g = c || WIKIREQUEST.info.siteId;
		var f = USE_SSL ? "https" : "http";
		var d = f + "://" + URL_HOST + "/default--flow/login__CreateAccountScreen?originSiteId=" + g;
		if (j) {
			d += "&invitationHash=" + j
		}
		var b = window.open(d, "login", "width=700,height=680,resizable=yes,directories=no,status=yes,menubar=yes,location=yes,scrollbars=yes");
		b.focus()
	},
	toggleEditSections: function (n) {
		if (WIKIDOT.page.vars.editSectionsActive == false) {
			var o = $("page-content");
			var b = o.childNodes;
			var t = new Array();
			for (var k = 0; k < b.length; k++) {
				var c = b[k].tagName;
				if (c && c.toLowerCase().match(/^h[1-6]$/) && b[k].id.match(/^toc/)) {
					t.push(b[k])
				}
			}
			if (t.length == 0) {
				var s = new OZONE.dialogs.ErrorDialog();
				s.content = "There are no isolated sections to edit.";
				s.show();
				return
			}
			var r = 0;
			var d = ["h1", "h2", "h3", "h4", "h5", "h6"];
			for (var k = 0; k < d.length; k++) {
				var l = o.getElementsByTagName(d[k]);
				for (var g = 0; g < l.length; g++) {
					if (l[g].id.match(/^toc/)) {
						r++
					}
				}
			}
			if (r != t.length) {
				alert("It seems that headings do not have a valid structure...");
				return
			}
			var f = new Array();
			for (var k = 0; k < t.length; k++) {
				var q = document.createElement("a");
				q.innerHTML = "edit";
				q.href = "javascript:;";
				q.className = "edit-section-button";
				q.id = "edit-section-b-" + t[k].id.replace(/toc/, "");
				YAHOO.util.Event.addListener(q, "click", WIKIDOT.page.listeners.editSection);
				var h = new fx.Opacity(q, {
						duration: 300
					});
				h.setOpacity(0);
				o.insertBefore(q, t[k]);
				h.custom(0, 1);
				f.push(q)
			}
			WIKIDOT.page.vars.editHeadings = t;
			WIKIDOT.page.vars.sectionEditButtons = f;
			WIKIDOT.page.vars.editSectionsActive = true
		} else {
			var m = WIKIDOT.page.vars.sectionEditButtons;
			for (var k = 0; k < m.length; k++) {
				m[k].parentNode.removeChild(m[k])
			}
			WIKIDOT.page.vars.editSectionsActive = false;
			return
		}
	},
	editMetaClick: function (c) {
		var b = new Object();
		b.pageId = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("edit/EditMetaModule", b, WIKIDOT.page.callbacks.editMeta)
	},
	editTags: function (c) {
		var b = new Object();
		b.pageId = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("pagetags/PageTagsModule", b, WIKIDOT.page.callbacks.editTags)
	},
	updateTagsByButton: function (f, c) {
		var d = $j(f.target);
		var b = new OZONE.dialogs.WaitBox();
		b.content = d.data("progress-text") || "Updating tags...";
		b.show();
		OZONE.ajax.requestModule(null, {
			action: "WikiPageAction",
			event: "updateTagsByButton",
			pageId: WIKIREQUEST.info.pageId,
			tags: c
		}, function (g) {
			if (!WIKIDOT.utils.handleError(g)) {
				return
			}
			var e = new OZONE.dialogs.SuccessBox();
			e.content = d.data("success-text") || "Tags updated.";
			e.show();
			window.location.reload()
		})
	},
	siteTools: function (b) {
		OZONE.ajax.requestModule("sitetools/SiteToolsModule", null, WIKIDOT.page.callbacks.siteTools)
	},
	backlinksClick: function (d) {
		var b = WIKIREQUEST.info.pageId;
		var c = new Object();
		c.page_id = b;
		OZONE.ajax.requestModule("backlinks/BacklinksModule", c, WIKIDOT.page.callbacks.backlinksClick)
	},
	watchersClick: function (d) {
		var b = WIKIREQUEST.info.pageId;
		var c = {};
		c.page_id = b;
		c.verbose = true;
		OZONE.ajax.requestModule("watch/WhoWatchesModule", c, WIKIDOT.page.callbacks.backlinksClick)
	},
	viewSourceClick: function (d) {
		var b = WIKIREQUEST.info.pageId;
		var c = new Object();
		c.page_id = b;
		OZONE.ajax.requestModule("viewsource/ViewSourceModule", c, WIKIDOT.page.callbacks.viewSourceClick)
	},
	closeActionArea: function (d) {
		var b = $("action-area");
		if (b) {
			if (("page-options-bottom")) {
				var c = new fx.ScrollBottom({
						duration: 100,
						transition: fx.sineOut
					});
				c.scrollTo("page-options-bottom")
			}
			setTimeout('$j("#action-area").html("");$("action-area").style.display = "none"', 200)
		}
	},
	userInfo: function (b) {
		var c = new Object();
		c.user_id = b;
		OZONE.ajax.requestModule("users/UserInfoWinModule", c, WIKIDOT.page.callbacks.userInfo)
	},
	anonymousUserInfo: function (b) {
		var c = new Object();
		c.userString = b;
		OZONE.ajax.requestModule("users/AnonymousInfoWinModule", c, WIKIDOT.page.callbacks.userInfo)
	},
	renamePage: function (c) {
		var b = new Object();
		b.pageId = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("rename/RenamePageModule", b, WIKIDOT.page.callbacks.renamePage)
	},
	deletePage: function (c) {
		var b = new Object();
		b.pageId = WIKIREQUEST.info.pageId;
		b["delete"] = "yes";
		OZONE.ajax.requestModule("rename/RenamePageModule", b, WIKIDOT.page.callbacks.renamePage)
	},
	createPageDiscussion: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		b.action = "ForumAction";
		b.event = "createPageDiscussionThread";
		OZONE.ajax.requestModule("Empty", b, WIKIDOT.page.callbacks.createPageDiscussion)
	},
	flagPageObjectionable: function (c) {
		var b = new Object();
		b.path = window.location.pathname;
		OZONE.ajax.requestModule("report/FlagPageModule", b, WIKIDOT.page.callbacks.flagPageObjectionable)
	},
	pageBugReport: function (b) {
		OZONE.ajax.requestModule("report/BugReportModule", null, WIKIDOT.page.callbacks.pageBugReport)
	},
	pageRate: function (b) {
		OZONE.ajax.requestModule("pagerate/PageRateModule", {
			pageId: WIKIREQUEST.info.pageId
		}, WIKIDOT.page.callbacks.pageRate)
	},
	parentClick: function (c) {
		var b = new Object();
		b.page_id = WIKIREQUEST.info.pageId;
		OZONE.ajax.requestModule("parent/ParentPageModule", b, WIKIDOT.page.callbacks.parentClick)
	},
	passwordRecoveryClick: function (b) {
		OZONE.ajax.requestModule("passwordrecovery/PasswordRecoveryModule", null, WIKIDOT.page.callbacks.passwordRecovery)
	},
	foldToc: function (c) {
		var b = new fx.Opacity($("toc-list"), {
				duration: 200,
				onComplete: function () {
					$("toc-list").style.display = "none";
					var d = $("toc-action-bar").getElementsByTagName("a");
					d[0].style.display = "none";
					d[1].style.display = ""
				}
			});
		b.custom(1, 0)
	},
	unfoldToc: function (d) {
		var c = new fx.Opacity($("toc-list"), {
				duration: 200
			});
		c.setOpacity(0);
		$("toc-list").style.display = "block";
		c.custom(0, 1);
		var b = $("toc-action-bar").getElementsByTagName("a");
		b[1].style.display = "none";
		b[0].style.display = ""
	},
	search: function (d) {
		var c = $("search-top-box-input").value;
		c = encodeURIComponent(c);
		var b = "/search:site/q/" + c;
		window.location.href = b;
		YAHOO.util.Event.preventDefault(d)
	},
	printClick: function (c) {
		var b = "/printer--friendly/" + window.location.pathname;
		var d = window.open(b, "_blank", "location=no,menubar=yes,titlebar=no,resizable=yes,scrollbars=yes,width=" + (screen.width * 0.8) + ",height=" + (screen.height * 0.8) + ",top=" + (screen.height * 0.1) + ",left=" + (screen.width * 0.1));
		return d
	},
	awatch: function (f, g, j, b, d, h) {
		var k;
		var c = {};
		c.action = "WatchAction";
		c.event = "watch";
		if (d) {
			c.pageId = d;
			k = false
		} else {
			c.pageId = WIKIREQUEST.info.pageId;
			k = "watch/PageWatchStatusModule"
		}
		c.type = g;
		c.nolayout = true;
		if (j) {
			c.unsubscribe = true
		}
		var l = b;
		OZONE.ajax.requestModule(k, c, function (m) {
			if (m.status == "no_permission") {
				OZONE.ajax.requestModule("watch/NotLoggedInModule", {}, function (q) {
					var o = new OZONE.dialogs.ActionDialog();
					o.content = q.body;
					o.show();
					return
				});
				return
			}
			if (!WIKIDOT.utils.handleError(m)) {
				return
			}
			if (l) {
				window.location.reload();
				return
			}
			if (!d) {
				var n = YAHOO.util.Dom.getElementsByClassName("page-watch-options");
				for (i = 0; i < n.length; i++) {
					var e = new fx.Opacity(n[i], {
							duration: 300
						});
					e.setOpacity(0);
					$j(n[i]).html(m.body);
					e.custom(0, 1)
				}
			} else {
				WIKIDOT.modules.DAListModule.getSettings(h, true)
			}
		})
	},
	join: function (k, g) {
		var j = {
			action: "MembershipApplyAction",
			event: "join"
		};
		if (g == "now") {
			var c = new OZONE.dialogs.WaitBox();
			c.content = "Joining..";
			c.show();
			OZONE.ajax.requestModule(null, j, function (l) {
				if (!WIKIDOT.utils.handleError(l)) {
					return
				}
				var e = new OZONE.dialogs.SuccessBox();
				e.content = "Joined!";
				e.show();
				setTimeout(function () {
					window.location.reload()
				}, 1000)
			})
		}
		if (g == "create_account") {
			WIKIDOT.page.listeners.createAccount()
		}
		if (g == "unified") {
			var b = window.location;
			var h = WIKIREQUEST.info.siteId;
			var f = USE_SSL ? "https://" : "http://";
			var d = f + URL_HOST + "/default--flow/login__JoinScreen?originSiteId=" + h + "&originUri=" + b.protocol + "//" + b.host;
			window.open(d, "login", "width=700,height=550,resizable=yes,directories=no,status=yes,menubar=yes,location=yes,scrollbars=yes").focus()
		}
	}
};
WIKIDOT.page.callbacks = {
	filesClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		OZONE.utils.setInnerHTMLContent("action-area", b.body);
		$("action-area").style.display = "block";
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 200)
	},
	editClick: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		if (WIKIDOT.page.vars.newPage == true) {
			$("page-content").innerHTML = ""
		}
		if (WIKIDOT.page.vars.editSectionsActive) {
			WIKIDOT.page.listeners.toggleEditSections()
		}
		editMode = c.mode;
		if (c.locked == true) {
			WIKIDOT.page.vars.locked = true;
			OZONE.dialog.factory.shader().show();
			var k = OZONE.dialog.factory.boxcontainer();
			k.setContent(c.body);
			k.showContent();
			return
		} else {
			WIKIDOT.page.vars.locked = false;
			var b = WIKIREQUEST.info.pageId;
			if (b != null) {
				if ($("page-options-bottom")) {
					$("page-options-bottom").style.display = "none";
					$("page-options-bottom-2").style.display = "none"
				}
				if ($("page-options-area-bottom")) {
					$("page-options-area-bottom").style.display = "none"
				}
			}
			WIKIDOT.page.vars.editlock = new Object();
			WIKIDOT.page.vars.editlock.id = c.lock_id;
			WIKIDOT.page.vars.editlock.secret = c.lock_secret;
			WIKIDOT.page.vars.editlock.revisionId = c.page_revision_id;
			WIKIDOT.page.vars.editlock.timeLeft = c.timeLeft
		}
		if (editMode == "section") {
			if (c.section == null) {
				alert("Section edit error. Section does not exist");
				return
			}
			WIKIDOT.page.vars.editlock.rangeStart = c.rangeStart;
			WIKIDOT.page.vars.editlock.rangeEnd = c.rangeEnd;
			var g = "toc" + c.section;
			var j = $(g);
			var f = document.createElement("div");
			f.id = "edit-section-content";
			var e = $("page-content");
			e.insertBefore(f, j);
			var h = new RegExp("^h[1-" + j.tagName.replace(/h/i, "") + "]", "i");
			var d = j.nextSibling;
			f.appendChild(j);
			while (d != null) {
				if (d.tagName && d.tagName.match(h) && d.id.match(/^toc/)) {
					break
				}
				ns0 = d;
				d = d.nextSibling;
				f.appendChild(ns0)
			}
			if (d) {
				e.insertBefore($("action-area"), d)
			} else {
				e.appendChild($("action-area"))
			}
		}
		if (c.draft) {
			WIKIDOT.page.vars.draft = c.draft;
			WIKIDOT.page.vars.draftText = c.draftText;
			WIKIDOT.page.vars.draftTitle = c.draftTitle;
			WIKIDOT.page.vars.draftDateLastSaved = c.draftDateLastSaved
		}
		OZONE.utils.setInnerHTMLContent("action-area", c.body);
		$("action-area").style.display = "block";
		if (!WIKIDOT.page.vars.draft) {
			setTimeout("OZONE.visuals.scrollTo('action-area')", 200)
		}
	},
	historyClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		OZONE.utils.setInnerHTMLContent("action-area", b.body);
		$("action-area").style.display = "block";
		WIKIDOT.page.utils.addCloseToActionArea()
	},
	logoutClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		window.location.reload()
	},
	passwordRecovery: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = new OZONE.dialogs.Dialog();
		b.content = c.body;
		b.show()
	},
	createAccount: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = new OZONE.dialogs.Dialog();
		b.content = c.body;
		b.show()
	},
	backlinksClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		OZONE.utils.setInnerHTMLContent("action-area", b.body);
		$("action-area").style.display = "block";
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	viewSourceClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		OZONE.utils.setInnerHTMLContent("action-area", b.body);
		$("action-area").style.display = "block";
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	userInfo: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = new OZONE.dialogs.Dialog();
		b.content = c.body;
		b.clickOutsideToClose = true;
		b.show()
	},
	renamePage: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	editTags: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	editMeta: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	blockClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	pageRate: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body.replace(/prw54353/, "prw54354")).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	siteTools: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		OZONE.dialog.hovertip.dominit("site-tools-box", {
			delay: 700,
			valign: "center"
		});
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300);
		WIKIDOT.page.utils.checkUrl("recheck")
	},
	parentClick: function (b) {
		if (!WIKIDOT.utils.handleError(b)) {
			return
		}
		$j("#action-area").html(b.body).show();
		WIKIDOT.page.utils.addCloseToActionArea();
		setTimeout("OZONE.visuals.scrollTo('action-area')", 300)
	},
	createPageDiscussion: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = "/forum/t-" + c.thread_id + "/" + c.thread_unix_title;
		window.location.href = b
	},
	flagPageObjectionable: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = new OZONE.dialogs.Dialog();
		b.content = c.body;
		b.show()
	},
	pageBugReport: function (c) {
		if (!WIKIDOT.utils.handleError(c)) {
			return
		}
		var b = new OZONE.dialogs.Dialog();
		b.content = c.body;
		b.show()
	}
};
WIKIDOT.page.utils = {
	scrollToReference: function (b) {
		OZONE.visuals.scrollTo(b, {
			blink: true
		})
	},
	addCloseToActionArea: function () {
		var b = document.createElement("a");
		b.innerHTML = "<i class='icon-remove'></i> Close";
		b.href = "javascript:;";
		b.className = "action-area-close btn btn-danger";
		var c = $("action-area");
		if (c.firstChild) {
			c.insertBefore(b, c.firstChild)
		} else {
			c.appendChild(b)
		}
		YAHOO.util.Event.addListener(b, "click", WIKIDOT.page.listeners.closeActionArea)
	},
	openHelpPop: function (b) {
		var c = window.open("http://test.wikidot.com/default--screen/HelpPop/topic/" + b, "_blank", "location=no,menubar=no,titlebar=no,resizable=yes,scrollbars=yes,width=" + (screen.width * 0.8) + ",height=" + (screen.height * 0.8) + ",top=" + (screen.height * 0.1) + ",left=" + (screen.width * 0.1));
		return c
	},
	checkUrl: function (b) {
		if (!b || b == "recheck") {
			if (b == "recheck") {
				var d = true
			}
			var f = $j(location).attr("href");
			var e = /\#_\w*/;
			var c = e.exec(f);
			if (c) {
				var h = new String(c);
				b = h.substr(2).toLowerCase()
			}
			if (!d) {
				if (b == "sitetools" || b == "orphanedpages" || b == "wantedpages" || b == "draftpages") {
					WIKIDOT.page.listeners.siteTools();
					return
				}
			}
			var g = window.location.pathname;
			if (g.match(/^\/[a-z0-9\-:_]+\/edit\/true/) || WIKIREQUEST.autoEdit) {
				WIKIDOT.page.listeners.editClick();
				return
			}
		}
		if (d && !WIKIDOT.modules.SiteToolsModule) {
			setTimeout("WIKIDOT.page.utils.checkUrl('recheck')", 300);
			return
		}
		switch (b) {
		case "wantedpages":
			WIKIDOT.modules.SiteToolsModule.listeners.wantedPages();
			break;
		case "orphanedpages":
			WIKIDOT.modules.SiteToolsModule.listeners.orphanedPages();
			break;
		case "draftpages":
			WIKIDOT.modules.SiteToolsModule.listeners.draftPages();
			break;
		case "editpage":
			WIKIDOT.page.listeners.editClick();
			break;
		case "edittags":
			WIKIDOT.page.listeners.editTags();
			break;
		case "history":
			WIKIDOT.page.listeners.historyClick();
			break;
		case "files":
			WIKIDOT.page.listeners.filesClick();
			break
		}
	}
};
WIKIDOT.page.fixers = {
	fixMathRef: function () {
		$j("a.eref").bind("mouseenter", function (c) {
			var b = $j("#equation-" + $j(this).text() + " .MathJax_Display");
			if (b.length == 1) {
				OZONE.dialog.hovertip.makeTip(this, {
					text: b.html(),
					valign: "center",
					style: {
						width: "auto",
						backgroundColor: "white"
					}
				});
				$j(this).unbind("mouseenter");
				OZONE.dialog.hovertip._mouseover(c)
			}
		})
	},
	fixFootnoteRef: function (b) {
		var g = YAHOO.util.Dom.getElementsByClassName("footnoteref", "a", b);
		for (var c = 0; c < g.length; c++) {
			var e = g[c];
			var j = e.id.replace(/^footnoteref\-/, "");
			var h = $("footnote-" + j);
			var d = h.innerHTML.replace(/<a.*?<\/a>\. /, "");
			var f = '<div class="footnote"><div class="f-heading">Footnote ' + j + '.</div><div class="f-content">' + d + '</div><div class="f-footer">(click to scroll to footnotes)</div></div>';
			OZONE.dialog.hovertip.makeTip(e, {
				text: f,
				valign: "center",
				smartWidthLimit: 0.7,
				style: {
					width: "auto",
					backgroundColor: "white"
				}
			})
		}
	},
	fixBibRef: function (b) {
		var e = YAHOO.util.Dom.getElementsByClassName("bibcite", "a", b);
		for (var c = 0; c < e.length; c++) {
			var h = e[c];
			var j = h.id.replace(/bibcite\-/, "");
			j = j.replace(/\-[0-9]+a$/, "");
			var f = $("bibitem-" + j);
			var d = f.innerHTML.replace(/^\s*[0-9]+\.\s*/, "");
			var g = '<div class="reference"><div class="r-heading">Reference ' + j.replace(/^([0-9]+\-)/, "") + '.</div><div class="r-content">' + d + '</div><div class="r-footer">(click to scroll to bibliography)</div></div>';
			OZONE.dialog.hovertip.makeTip(h, {
				text: g,
				valign: "center",
				smartWidthLimit: 0.7,
				style: {
					width: "auto",
					backgroundColor: "white"
				}
			})
		}
	},
	fixMenu: function (b) {
		var e = $(b);
		if (e == null) {
			return
		}
		var d = e.getElementsByTagName("li");
		for (var c = 0; c < d.length; c++) {
			YAHOO.util.Event.addListener(d[c], "mouseover", function (f) {
				YAHOO.util.Dom.addClass(this, "sfhover")
			});
			YAHOO.util.Event.addListener(d[c], "mouseout", function (f) {
				YAHOO.util.Dom.removeClass(this, "sfhover")
			})
		}
	},
	fixEmail: function (f) {
		var g = jQuery;
		var b = g(f).text();
		if (b.match(/^([a-z0-9\-\.\|_])+#/i)) {
			var e = b.split("#");
			var d = e[0].split("").reverse().join("").replace("|", "@");
			var h = e[1].split("").reverse().join("").replace("|", "@");
			var c = g("<a/>").attr("href", "mailto:" + d).html(h);
			g(f).html(c).css({
				visibility: "visible"
			})
		}
	},
	fixFoldableMenus: function () {
		var m = YAHOO.util.Dom.getElementsByClassName("foldable-list-container", "div");
		for (var h = 0; h < m.length; h++) {
			var o = m[h].getElementsByTagName("ul");
			for (var f = 0; f < o.length; f++) {
				var l = o[f];
				var g = l.parentNode;
				var e = true;
				while (g && !YAHOO.util.Dom.hasClass(g, "foldable-list-container")) {
					if (g.tagName && g.tagName.toLowerCase() == "li") {
						e = false;
						break
					}
					g = g.parentNode
				}
				if (!e) {
					l.originalDisplay = l.style.display;
					l.style.display = "none";
					YAHOO.util.Dom.addClass(g, "folded");
					g.eff = new fx.Opacity(l, {
							duration: 300
						});
					var c = g.childNodes[0];
					if (c.tagName != "A") {
						var n = document.createElement("a");
						g.insertBefore(n, c);
						n.appendChild(c);
						n.href = "javascript:;"
					}
				}
			}
			var d = m[h].getElementsByTagName("a");
			var k = window.location.pathname;
			for (var f = 0; f < d.length; f++) {
				var b = d[f].href.replace(/^[a-z]*:\/\/[^\/]+\/([^\/]+).*/, "/$1");
				if (b == k) {
					var g = d[f].parentNode;
					while (g && !YAHOO.util.Dom.hasClass(g, "foldable-list-container")) {
						if (g.tagName == "LI" && YAHOO.util.Dom.hasClass(g, "folded")) {
							YAHOO.util.Dom.replaceClass(g, "folded", "unfolded");
							var l = g.getElementsByTagName("ul")[0];
							l.style.display = l.originalDisplay
						}
						g = g.parentNode
					}
				}
			}
			YAHOO.util.Event.addListener(m[h], "click", WIKIDOT.page.fixers._foldableMenuToggle)
		}
	},
	_foldableMenuToggle: function (d) {
		var b;
		b = YAHOO.util.Event.getTarget(d, true);
		if (b.tagName == "A" && b.href != "#" && b.href != "javascript:;") {
			return
		}
		while (!b.tagName || b.tagName.toLowerCase() != "li") {
			b = b.parentNode
		}
		if (!(YAHOO.util.Dom.hasClass(b, "folded") || YAHOO.util.Dom.hasClass(b, "unfolded"))) {
			return
		}
		if (YAHOO.util.Dom.hasClass(b, "folded")) {
			YAHOO.util.Dom.replaceClass(b, "folded", "unfolded");
			var c = b.getElementsByTagName("ul")[0];
			b.eff.setOpacity(0);
			c.style.display = c.originalDisplay;
			b.eff.custom(0, 1)
		} else {
			YAHOO.util.Dom.replaceClass(b, "unfolded", "folded");
			var c = b.getElementsByTagName("ul")[0];
			c.style.display = "none"
		}
	},
	fixMenuList: function (b) {
		b = $(b);
		if (!b) {
			return
		}
		var d = b.getElementsByTagName("li");
		for (var e = 0; e < d.length; e++) {
			var f = d[e].childNodes[0];
			if (f.tagName != "A" && f.nodeType == 3 && f.innerHTML != "") {
				var c = document.createElement("a");
				d[e].insertBefore(c, f);
				c.appendChild(f);
				c.href = "javascript:;"
			}
		}
	}
};
WIKIDOT.page.vars = {
	editSectionsActive: false
};
WIKIDOT.page.account = {};
WIKIDOT.page.account.shower = function (c) {
	var b = $("account-options");
	if (!b.eff) {
		b.eff = new fx.Opacity(b, {
				duration: 200
			})
	}
	b.eff.setOpacity(0);
	b.style.display = "block";
	b.eff.custom(0, 1)
};
WIKIDOT.page.account.closer = function (f) {
	var c = $("account-options");
	var b = YAHOO.util.Event.getRelatedTarget(f);
	var d = false;
	if (b == c) {
		d = true
	}
	if (b.parentNode == c) {
		d = true
	}
	if (b.parentNode.parentNode == c) {
		d = true
	}
	if (b.parentNode.parentNode.parentNode == c) {
		d = true
	}
	if (d == true) {
		return
	}
	c.eff.setOpacity(0);
	c.style.display = "none"
};
WIKIDOT.page.init = function () {
	YAHOO.util.Event.addListener("edit-button", "click", WIKIDOT.page.listeners.editClick);
	YAHOO.util.Event.addListener("pagerate-button", "click", WIKIDOT.page.listeners.pageRate);
	YAHOO.util.Event.addListener("tags-button", "click", WIKIDOT.page.listeners.editTags);
	YAHOO.util.Event.addListener("history-button", "click", WIKIDOT.page.listeners.historyClick);
	YAHOO.util.Event.addListener("files-button", "click", WIKIDOT.page.listeners.filesClick);
	YAHOO.util.Event.addListener("print-button", "click", WIKIDOT.page.listeners.printClick);
	YAHOO.util.Event.addListener("site-tools-button", "click", WIKIDOT.page.listeners.siteTools);
	YAHOO.util.Event.addListener("more-options-button", "click", WIKIDOT.page.listeners.moreOptionsClick);
	YAHOO.util.Event.addListener("edit-append-button", "click", WIKIDOT.page.listeners.append);
	YAHOO.util.Event.addListener("edit-sections-button", "click", WIKIDOT.page.listeners.toggleEditSections);
	YAHOO.util.Event.addListener("edit-meta-button", "click", WIKIDOT.page.listeners.editMetaClick);
	YAHOO.util.Event.addListener("backlinks-button", "click", WIKIDOT.page.listeners.backlinksClick);
	YAHOO.util.Event.addListener("watchers-button", "click", WIKIDOT.page.listeners.watchersClick);
	YAHOO.util.Event.addListener("parent-page-button", "click", WIKIDOT.page.listeners.parentClick);
	YAHOO.util.Event.addListener("view-source-button", "click", WIKIDOT.page.listeners.viewSourceClick);
	YAHOO.util.Event.addListener("page-block-button", "click", WIKIDOT.page.listeners.blockClick);
	YAHOO.util.Event.addListener("rename-move-button", "click", WIKIDOT.page.listeners.renamePage);
	YAHOO.util.Event.addListener("delete-button", "click", WIKIDOT.page.listeners.deletePage);
	YAHOO.util.Event.addListener("search-top-box-form", "submit", WIKIDOT.page.listeners.search);
	jQuery(function () {
		OZONE.dialog.hovertip.dominit("html-body", {
			delay: 700,
			valign: "center"
		});
		WIKIDOT.page.fixers.fixMenuList("top-bar");
		WIKIDOT.page.fixers.fixFoldableMenus();
		WIKIDOT.page.fixers.fixMathRef();
		WIKIDOT.page.fixers.fixFootnoteRef();
		WIKIDOT.page.fixers.fixBibRef();
		var f = $("account-topbutton");
		if (f) {
			YAHOO.util.Event.addListener(f, "mousedown", WIKIDOT.page.account.shower);
			YAHOO.util.Event.addListener("account-options", "mouseout", WIKIDOT.page.account.closer)
		}
		WIKIDOT.page.fixers.fixMenu("top-bar");
		WIKIDOT.page.fixers.fixMenu("side-bar");
		var e = $("notifications-dialog");
		if (e != null) {
			var d = new OZONE.dialogs.Dialog();
			d.content = e.innerHTML;
			d.show();
			setTimeout("OZONE.dialog.factory.boxcontainer().centerContent();", 1000)
		}
		WIKIDOT.page.utils.checkUrl();
		var g = "/" + WIKIREQUEST.info.pageUnixName;
		var c = location.protocol + "//" + WIKIREQUEST.info.domain + g;
		jQuery("#top-bar, .mark-current-link").find("a[href='" + g + "'], a[href='" + c + "']").addClass("current-link");
		jQuery("#discuss-button").attr("href", jQuery("#discuss-button").attr("href") + location.hash)
	});
	OZONE.loc.addMessage("close window", "zamknij okno", "pl");
	OZONE.loc.addMessage("close message", "zamknij wiadomo????", "pl");
	OZONE.loc.addMessage("Error", "Blad", "pl");
	OZONE.loc.addMessage("Oooops!", "Ups!", "pl");
	OZONE.loc.addMessage("Permission error", "B????d uprawnie??", "pl");
	var b = {
		ago: "temu",
		day: "dzie??",
		days: "dni",
		hours: "godziny",
		hour: "godzina",
		minutes: "minuty",
		minute: "minuta",
		seconds: "sekundy",
		second: "sekunda"
	};
	OZONE.loc.addMessages(b, "pl")
};
WIKIDOT.page.init();
(function (c) {
	c("div.wikidot-hybrid-module[id^=wikidot-hybrid-module-]").livequery(function () {
		var d = c(this);
		d.removeClass("wikidot-hybrid-module").addClass("wikidot-hybrid-module-loading");
		var e = JSON.parse(c("div", d).text());
		OZONE.ajax.requestModule(e.module, e.params, function (f) {
			d.replaceWith(f.body)
		}, null, {
			noCursorWait: true,
			ignoreCodeZero: true
		})
	});
	c("span.odate").livequery(function () {
		OZONE.utils.formatOdate(this)
	});
	c("span.wiki-email").livequery(function () {
		WIKIDOT.page.fixers.fixEmail(this)
	});
	c("span.printuser.avatarhover").livequery(function () {
		WIKIDOT.render.fixAvatarHover(this)
	});
	c("a[href='#action:login']").livequery("click", function () {
		if (!WIKIREQUEST.userId) {
			WIKIDOT.page.listeners.loginClick();
			return false
		}
	});
	c("div.collapsible-block a.collapsible-block-link").livequery("click", function () {
		var d = c(this).parents("div.collapsible-block").first();
		if (d.find(".collapsible-block-folded").is(":visible")) {
			d.find(".collapsible-block-folded").hide();
			var e = d.find(".collapsible-block-unfolded");
			e.find(".collapsible-block-content").hide();
			e.show();
			e.find(".collapsible-block-content").fadeIn("fast")
		} else {
			d.find(".collapsible-block-unfolded").hide();
			d.find(".collapsible-block-folded").show()
		}
	});
	c(function () {
		if (c("#navi-bar").length > 0) {
			var d = c("#navi-bar").height();
			d += 6;
			var f = function (g) {
				g = g || 0;
				setTimeout(function () {
					var j = document.location.hash.replace(/^#?/, "");
					if (j.match(/^[a-zA-Z0-9_-]+$/)) {
						var h = c("#" + j + ', a[name="' + j + '"]');
						if (h.length == 1) {
							if (Math.abs(h.offset().top - c(document).scrollTop()) <= 2) {
								window.scrollBy(0, -d)
							}
						}
					}
				}, g)
			};
			var e = function () {
				f(200)
			};
			if ("onhashchange" in window) {
				window.onhashchange = f
			}
			c('a[href^="#"]').livequery("click", e);
			if (window.location.hash) {
				window.onload = f
			}
		}
	});
	var b = false;
	c(".math-equation, .math-inline").livequery(function () {
		if (!b) {
			var e = document.createElement("script");
			e.type = "text/javascript";
			e.src = "https://cdn.mathjax.org/mathjax/2.1-latest/MathJax.js?config=default";
			var f = 'MathJax.Hub.Config({showProcessingMessages: false,jax: ["input/TeX","output/HTML-CSS"],extensions: ["tex2jax.js","MathMenu.js","MathZoom.js"],TeX: {  extensions: ["AMSmath.js","AMSsymbols.js","noUndefined.js", "boldsymbol.js", "mathchoice.js", "unicode.js"]},tex2jax: {  inlineMath: [ ["$","$"], ["\\(","\\)"] ],  skipTags: ["body"],  processEnvironments: true},"HTML-CSS": {  styles: {    ".MathJax_Display": { "margin": "0.5em 0"    }   }}});MathJax.Hub.Startup.onload();';
			if (window.opera) {
				e.innerHTML = f
			} else {
				e.text = f
			}
			document.getElementsByTagName("head")[0].appendChild(e);
			b = true
		}
		var d = function (j) {
			var h = c(j);
			if (h.find(".merror").length == 1 || h.find('span.mtext[style~="color: red;"]:contains("\\")').length > 0 || h.find(".MathJax_Error").length == 1) {
				var l = "The equation has not been processed correctly. Click to learn more.";
				var k = c('<a href="http://www.wikidot.com/doc:math" target="_blank">?</a>');
				if (h.hasClass("math-equation")) {
					k.attr("class", "math-equation-error");
					k.appendTo(h.find(".MathJax_Display, .MathJax_Error"))
				} else {
					k.attr("class", "inline-math-error");
					k.insertAfter(h).get(0)
				}
				OZONE.dialog.hovertip.makeTip(k.get(0), {
					text: l,
					style: {
						width: "auto",
						backgroundColor: "white"
					}
				})
			}
		};
		var g = function (h) {
			if (!window.MathJax) {
				setTimeout(function () {
					g(h)
				}, 200);
				return
			}
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, h], [function (j) {
						c(j).show()
					}, h], [d, h])
		};
		g(this)
	})
})($j);
$j(function () {
	if ($j("#login-status .printuser").length == 0 && !$j.cookie("COOKIE_POLICY_OK")) {
		OZONE.ajax.requestModule("misc/CookiePolicyPlModule", {}, function (b) {
			if (b.body) {
				$j("body").append($j(b.body))
			}
		})
	}
	jQuery("a").each(function () {
		if (jQuery(this).attr("href") === window.location.pathname) {
			jQuery(this).addClass("active")
		}
	})
});
var INSERT_NEWLINE = "\n";
var MATCH_NEWLINE = "\r?\n";
WIKIDOT.Editor = {
	editElementId: null,
	toolbarPanelId: null,
	ranger: null
};
WIKIDOT.Editor.currentPos = null;
WIKIDOT.Editor.currentRange = [0, 0];
WIKIDOT.Editor.init = function (d, c, b) {
	WIKIDOT.Editor.editElementId = d;
	WIKIDOT.Editor.toolbarPanelId = c;
	WIKIDOT.Editor.ranger = new TextElementProxyUtil(d, b);
	YAHOO.util.Event.addListener(this.editElementId, "keypress", WIKIDOT.Editor.keyboardListener);
	YAHOO.util.Event.addListener(this.editElementId, "keydown", function () {
		WIKIDOT.Editor.lastKeyCode = null
	});
	YAHOO.util.Event.addListener(this.editElementId, "keyup", WIKIDOT.Editor.codeAssist.listener);
	OZONE.ajax.requestModule("edit/EditToolbarModule", {}, WIKIDOT.Editor.initCallback);
	OZONE.loc.addMessage("cancel", "anuluj", "pl");
	OZONE.loc.addMessage("insert code", "wstaw kod", "pl");
	OZONE.loc.addMessage("Image wizard", "Magik wstawiania obrazu", "pl");
	OZONE.loc.addMessage("Table wizard", "Magik tabeli", "pl");
	if (YAHOO.env.ua.ie == 8) {
		WIKIDOT.Editor.resizeIe();
		$j(window).resize(WIKIDOT.Editor.resizeIe)
	}
};
WIKIDOT.Editor.resizeIe = function () {
	var b = $j("#" + WIKIDOT.Editor.editElementId);
	b.css("width", "97%");
	var c = b.width();
	b.css("width", "auto");
	if (!WIKIDOT.Editor.ratio) {
		b.attr("cols", 60);
		WIKIDOT.Editor.ratio = b.width() / 60
	}
	b.attr("cols", c / WIKIDOT.Editor.ratio)
};
WIKIDOT.Editor.shutDown = function () {
	YAHOO.util.Event.removeListener(this.editElementId, "keypress", WIKIDOT.Editor.keyboardListener);
	YAHOO.util.Event.removeListener(this.editElementId, "keyup", WIKIDOT.Editor.codeAssist.listener);
	WIKIDOT.Editor.ranger = null;
	WIKIDOT.Editor.toolbarPanelId = null;
	WIKIDOT.Editor.editElementId = null
};
WIKIDOT.Editor.initCallback = function (d) {
	if (!WIKIDOT.utils.handleError(d)) {
		return
	}
	if ($j("#wd-ed-dialogs").length == 0) {
		var e = $j("<div/>").attr("id", "wd-ed-dialogs").hide().html(d.body || "");
		$j("body").append(e)
	}
	var c = $(WIKIDOT.Editor.toolbarPanelId);
	if (c) {
		$j(c).html($j("#wd-ed-toolbar").html());
		var b = $j("a", c);
		OZONE.dialog.hovertip.makeTip(b, {
			style: {
				width: "auto"
			},
			delay: 200
		});
		WIKIDOT.page.fixers.fixMenu(c)
	}
	if (WIKIDOT.page.vars.draft) {
		jQuery("body").scrollTo(".owindow", 0, {
			offset: -window.innerHeight / 2
		})
	}
};
WIKIDOT.Editor.buttons = {
	bold: function (b) {
		WIKIDOT.Editor.utils.insertTags("**", "**", "bold text", WIKIDOT.Editor.utils.trimSelection)
	},
	italic: function (b) {
		WIKIDOT.Editor.utils.insertTags("//", "//", "italic text", WIKIDOT.Editor.utils.trimSelection)
	},
	underline: function (b) {
		WIKIDOT.Editor.utils.insertTags("__", "__", "underline text", WIKIDOT.Editor.utils.trimSelection)
	},
	strikethrough: function (b) {
		WIKIDOT.Editor.utils.insertTags("--", "--", "strikethrough text", WIKIDOT.Editor.utils.trimSelection)
	},
	teletype: function (b) {
		WIKIDOT.Editor.utils.insertTags("{{", "}}", "teletype text", WIKIDOT.Editor.utils.trimSelection)
	},
	superscript: function (b) {
		WIKIDOT.Editor.utils.insertTags("^^", "^^", "superscript", WIKIDOT.Editor.utils.trimSelection)
	},
	subscript: function (b) {
		WIKIDOT.Editor.utils.insertTags(",,", ",,", "subscript", WIKIDOT.Editor.utils.trimSelection)
	},
	raw: function (b) {
		WIKIDOT.Editor.utils.insertTags("@@", "@@", "raw text", WIKIDOT.Editor.utils.trimSelection)
	},
	heading: function (d, f) {
		var b = "";
		for (var c = 0; c < f; c++) {
			b += "+"
		}
		WIKIDOT.Editor.utils.insertTags(b + " ", "", "heading level " + f, WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWith2NewLine, WIKIDOT.Editor.utils.startWith2NewLine)
	},
	quote: function (b) {
		WIKIDOT.Editor.utils.insertTags("> ", "", "quoted text", WIKIDOT.Editor.utils.processQuoteText, WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast1NewLine)
	},
	hr: function (b) {
		WIKIDOT.Editor.utils.insertText("------", WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	clearFloat: function (c, b) {
		var d = "~~~~";
		if (b) {
			d += b
		}
		WIKIDOT.Editor.utils.insertText(d, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	toc: function (b) {
		WIKIDOT.Editor.utils.insertText("[[toc]]", WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast1NewLine)
	},
	uri: function (b) {
		WIKIDOT.Editor.utils.insertTags("[http://www.example.com ", "]", "describe link", WIKIDOT.Editor.utils.trimSelection)
	},
	pageLink: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[[", "]]]", "page name", WIKIDOT.Editor.utils.trimSelection)
	},
	math: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[math]]" + INSERT_NEWLINE, INSERT_NEWLINE + "[[/math]]", "insert LaTeX equation here", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	numberedList: function (b) {
		WIKIDOT.Editor.utils.insertTags("# ", "", "list item", WIKIDOT.Editor.utils.processNumberedList, WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast1NewLine)
	},
	bulletedList: function (b) {
		WIKIDOT.Editor.utils.insertTags("* ", "", "list item", WIKIDOT.Editor.utils.processBulletedList, WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast1NewLine)
	},
	definitionList: function (b) {
		WIKIDOT.Editor.utils.insertTags(": ", " : definition", "item", WIKIDOT.Editor.utils.processBulletedList, WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast1NewLine)
	},
	increaseListIndent: function (b) {
		WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.utils.increaseListIndent)
	},
	decreaseListIndent: function (b) {
		WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.utils.decreaseListIndent)
	},
	footnote: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[footnote]] ", " [[/footnote]]", "footnote text", WIKIDOT.Editor.utils.trimSelection)
	},
	inlineMath: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[$ ", " $]]", "insert LaTeX equation here", WIKIDOT.Editor.utils.trimSelection)
	},
	code: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[code]]" + INSERT_NEWLINE, INSERT_NEWLINE + "[[/code]]", "insert the code here", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	html: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[html]]" + INSERT_NEWLINE, INSERT_NEWLINE + "[[/html]]", "Insert any HTML code, including widgets and video or audio players", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	image: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[image ", "]]", "source", WIKIDOT.Editor.utils.trimSelection)
	},
	div: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[div]]" + INSERT_NEWLINE, INSERT_NEWLINE + "[[/div]]", "block contents", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	bibliography: function (b) {
		WIKIDOT.Editor.utils.insertTags("[[bibliography]]" + INSERT_NEWLINE + ": ", " : full source reference" + INSERT_NEWLINE + "[[/bibliography]]", "label", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine)
	},
	bibliographycitation: function (b) {
		WIKIDOT.Editor.utils.insertTags("[((bibcite ", "))]", "label", WIKIDOT.Editor.utils.trimSelection)
	},
	imageWizard: function (b) {
		WIKIDOT.Editor.currentPos = WIKIDOT.Editor.ranger.getSelectionRange()[0];
		var c = new OZONE.dialogs.Dialog();
		c.style.width = "70%";
		c.title = ogettext("Image wizard");
		c.buttons = ["cancel", "insert code"];
		c.addButtonListener("cancel", c.close);
		c.addButtonListener("insert code", WIKIDOT.Editor.imageWizard.insertCode);
		c.content = $("wd-ed-imagewizard-dialog").innerHTML.replace(/\-template/g, "");
		c.show();
		$j("#342type1").focus();
		if ($("np-title")) {
			$j(".image-wizard-source-attached").hide();
			$j(".image-wizard-source-attached input").attr("disabled", "disabled")
		} else {
			$j(".image-wizard-source-attached").show();
			$j(".image-wizard-source-attached input").removeAttr("disabled")
		}
		WIKIDOT.Editor.imageWizard.updateSourceBlock()
	},
	tableWizard: function (b) {
		WIKIDOT.Editor.currentPos = WIKIDOT.Editor.ranger.getSelectionRange()[0];
		var c = new OZONE.dialogs.Dialog();
		c.title = ogettext("Table wizard");
		c.buttons = ["cancel", "insert code"];
		c.addButtonListener("cancel", c.close);
		c.addButtonListener("insert code", WIKIDOT.Editor.listeners.tableWizardInsert);
		c.content = $("wd-ed-tablewizard-dialog").innerHTML.replace(/\-template/g, "");
		c.show();
		$j("#wd-ed-tablewizard-rows").focus()
	},
	uriWizard: function (b) {
		WIKIDOT.Editor.currentPos = WIKIDOT.Editor.ranger.getSelectionRange()[0];
		var c = new OZONE.dialogs.Dialog();
		c.title = ogettext("URL link wizard");
		c.buttons = ["cancel", "insert code"];
		c.addButtonListener("cancel", c.close);
		c.addButtonListener("insert code", WIKIDOT.Editor.listeners.uriWizardInsert);
		c.content = $("wd-ed-uriwizard-dialog").innerHTML.replace(/\-template/g, "");
		c.show();
		$j("#wd-ed-uriwizard-uri").focus()
	},
	pageLinkWizard: function (f) {
		WIKIDOT.Editor.currentPos = WIKIDOT.Editor.ranger.getSelectionRange()[0];
		var g = new OZONE.dialogs.Dialog();
		g.title = ogettext("Page link wizard");
		g.buttons = ["cancel", "insert code"];
		g.addButtonListener("cancel", g.close);
		g.addButtonListener("insert code", WIKIDOT.Editor.listeners.pageLinkWizardInsert);
		g.content = $("wd-ed-pagelinkwizard-dialog").innerHTML.replace(/\-template/g, "");
		g.show();
		var b = new YAHOO.util.XHRDataSource("/quickmodule.php");
		b.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
		b.responseSchema = {
			resultsList: "pages",
			fields: ["unix_name", "title"]
		};
		var c = new YAHOO.widget.AutoComplete("wd-ed-pagelinkwizard-page", "autocomplete3432", b);
		c.generateRequest = function (d) {
			return "?s=" + WIKIREQUEST.info.siteId + "&module=PageLookupQModule&q=" + d
		};
		c.formatResult = function (d, j) {
			var h = d[1];
			var e = d[0];
			if (e != null) {
				return "<div >" + e + '</div><div style="font-size: 85%;">(' + h + ")</div>"
			} else {
				return ""
			}
		};
		c.minQueryLength = 2;
		c.queryDelay = 0.5;
		c.forceSelection = false;
		c.autoHighlight = false;
		$j("#wd-ed-pagelinkwizard-page").focus()
	},
	codeWizard: function (b) {
		WIKIDOT.Editor.currentRange = WIKIDOT.Editor.ranger.getSelectionRange();
		var c = new OZONE.dialogs.Dialog();
		c.title = ogettext("Code block wizard");
		c.buttons = ["cancel", "insert code"];
		c.addButtonListener("cancel", c.close);
		c.addButtonListener("insert code", WIKIDOT.Editor.listeners.codeWizardInsert);
		c.content = $("wd-ed-codewizard-dialog").innerHTML.replace(/\-template/g, "");
		c.show();
		$j("#wd-ed-codewizard-type").focus()
	},
	erefWizard: function (f) {
		WIKIDOT.Editor.currentPos = WIKIDOT.Editor.ranger.getSelectionRange()[0];
		var g = new OZONE.dialogs.Dialog();
		g.title = ogettext("Equation reference wizard");
		g.buttons = ["cancel", "insert code"];
		g.addButtonListener("cancel", g.close);
		g.addButtonListener("insert code", WIKIDOT.Editor.erefWizard.insertCode);
		g.content = $("wd-ed-erefwizard-dialog").innerHTML.replace(/\-template/g, "");
		g.show();
		var m = $(WIKIDOT.Editor.editElementId).value;
		var h = m.match(/^\[\[math\s([a-zA-Z0-9]+)\]\](\r?\n.*)*?\r?\n\[\[\/math\]\]/mg);
		if (h == null || h.length == 0) {
			var l = new OZONE.dialogs.ErrorDialog();
			l.content = "Sorry, no labelled equations found.";
			l.show();
			return
		}
		var j = "";
		if (h.length == 0) {
			j = "no equations with labels available"
		} else {
			j = '<select id="wd-ed-erefwizard-ref">';
			for (var b = 0; b < h.length; b++) {
				var k = h[b].replace(/\[\[math\s(.+?)\]\](\r*\n.*)*/, "$1");
				var c = h[b].replace(/\[\[math[^\]]*\]\]((?:\r?\n.*)*?)\n\[\[\/math\]\]/, "$1");
				$("wd-ed-erefwizard-preview").innerHTML += '<div id="wd-ed-erefwizard-preview-' + k + '">' + c + "</div>";
				j += '<option value="' + k + '">' + k + "</option>"
			}
			j += "</select>"
		}
		$j("#wd-ed-erefwizard-options").html(j);
		OZONE.dialog.factory.boxcontainer().centerContent();
		WIKIDOT.Editor.erefWizard.changeRef(null);
		YAHOO.util.Event.addListener("wd-ed-erefwizard-ref", "change", WIKIDOT.Editor.erefWizard.changeRef);
		$j("#wd-ed-erefwizart-weq").focus()
	}
};
WIKIDOT.Editor.erefWizard = {};
WIKIDOT.Editor.erefWizard.changeRef = function (f) {
	var d = $("wd-ed-erefwizard-preview");
	var b = d.childNodes;
	for (var c = 0; c < b.length; c++) {
		b[c].style.display = "none"
	}
	$("wd-ed-erefwizard-preview-" + $("wd-ed-erefwizard-ref").value).style.display = "block"
};
WIKIDOT.Editor.erefWizard.insertCode = function (d) {
	var c = $("wd-ed-erefwizard-ref").value;
	var b = "[[eref " + c + "]]";
	if ($("wd-ed-erefwizart-weq").checked == true) {
		b = "Eq.(" + b + ")"
	}
	WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentPos, WIKIDOT.Editor.currentPos);
	WIKIDOT.Editor.utils.insertText(b);
	OZONE.dialog.cleanAll()
};
WIKIDOT.Editor.imageWizard = {};
WIKIDOT.Editor.imageWizard.updateSourceBlock = function (c) {
	var b;
	$("wd-ed-imagewizard-byuri").style.display = "none";
	$("wd-ed-imagewizard-byfile").style.display = "none";
	$("wd-ed-imagewizard-byflickr").style.display = "none";
	$("wd-ed-imagewizard-checkresult").innerHTML = "";
	if ($("342type1").checked == true) {
		b = "uri";
		$("wd-ed-imagewizard-byuri").style.display = "block"
	} else {
		if ($("342type2").checked == true) {
			b = "file";
			$("wd-ed-imagewizard-byfile").style.display = "block";
			WIKIDOT.Editor.imageWizard.updateAttachements()
		} else {
			if ($("342type3").checked == true) {
				b = "flickr";
				$("wd-ed-imagewizard-byflickr").style.display = "block"
			}
		}
	}
	WIKIDOT.Editor.imageWizard.source = b
};
WIKIDOT.Editor.imageWizard.updateAttachements = function () {
	OZONE.ajax.requestModule("editor/ImageAttachedFileModule", {
		pageId: WIKIREQUEST.info.pageId
	}, WIKIDOT.Editor.imageWizard.updateAttachementsCallback)
};
WIKIDOT.Editor.imageWizard.updateAttachementsCallback = function (b) {
	$j("#wd-ed-imagewizard-byfile-list").html(b.body);
	WIKIDOT.Editor.imageWizard.attachementSelect()
};
WIKIDOT.Editor.imageWizard.attachementSelect = function (d) {
	var c = $("wd-ed-imagewizard-byfile-filename");
	if (c) {
		var b = $("wd-ed-imagewizard-byfile-filename").value;
		var f = "/local--resized-images/" + WIKIREQUEST.info.requestPageName + "/" + b + "/thumbnail.jpg";
		$("wd-ed-imagewizard-byfile-preview").src = f
	}
};
WIKIDOT.Editor.imageWizard.checkFlickrImage = function (h) {
	var g = new Object();
	var f = $("wd-ed-imagewizard-checkresult");
	var c = $("wd-ed-imagewizard-flickr").value;
	var d = c.replace(/^http:\/\/(?:www\.)?flickr\.com\/.*?\/([0-9]+)(?:\/.*)?$/, "$1");
	var b = null;
	if (c.match(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/)) {
		d = c.replace(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/, "$1");
		b = c.replace(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/, "$2");
		g.secret = b
	}
	f.innerHTML = "checking image " + d + "...";
	if (!d.match(/^([0-9]+)$/)) {
		f.innerHTML = '<p style="color: red">Not a valid input for the flickr.com image.</p>';
		return
	}
	g.flickr_id = d;
	OZONE.ajax.requestModule("editor/FlickrCheckModule", g, WIKIDOT.Editor.imageWizard.checkFlickrImageCallback)
};
WIKIDOT.Editor.imageWizard.checkFlickrImageCallback = function (c) {
	var b = $("wd-ed-imagewizard-checkresult");
	$j(b).html(c.body)
};
WIKIDOT.Editor.imageWizard.checkUriImage = function (d) {
	var b = $("wd-ed-imagewizard-uri").value;
	var f = window.open("about:blank", "_blank", "location=no,menubar=no,titlebar=no,resizable=yes,scrollbars=yes,width=" + (screen.width * 0.5) + ",height=" + (screen.height * 0.5) + ",top=" + (screen.height * 0.25) + ",left=" + (screen.width * 0.25));
	f.document.write('<html><head><title>Checking image...</title></head><body><div style="text-align: center"><p>    If you see the image below - that means the location of the image you have entered is ok.</p> <img id="check-image" src="' + b + '" alt="image not available!"/><p><a href="javascript:;" onclick="window.close()">close this window</a></p></div></body></html>');
	var c = f.document.getElementById("check-image");
	YAHOO.util.Event.addListener(c, "load", WIKIDOT.Editor.imageWizard.checkUriImageResize, f)
};
WIKIDOT.Editor.imageWizard.checkUriImageResize = function (g, f) {
	var d = Math.min(this.width + 200, screen.availWidth - 100);
	var b = Math.min(this.height + 200, screen.availHeight - 100);
	var c = (screen.availWidth - d) * 0.5;
	var h = (screen.availHeight - b) * 0.5;
	f.resizeTo(d, b);
	f.moveTo(c, h)
};
WIKIDOT.Editor.imageWizard.insertCode = function (h) {
	var k = WIKIDOT.Editor.imageWizard.source;
	var b;
	if (k == "uri") {
		b = $("wd-ed-imagewizard-uri").value
	} else {
		if (k == "file") {
			b = $("wd-ed-imagewizard-byfile-filename").value
		} else {
			if (k == "flickr") {
				var l = $("wd-ed-imagewizard-flickr").value;
				var m = l.replace(/^http:\/\/(?:www\.)?flickr\.com\/.*?\/([0-9]+)(?:\/.*)?$/, "$1");
				var f = null;
				if (l.match(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/)) {
					m = l.replace(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/, "$1");
					f = l.replace(/^http:\/\/static\.flickr\.com\/[0-9]+\/([0-9]+)_([0-9a-z]+).*$/, "$2")
				}
				if (!m.match(/^([0-9]+)$/)) {
					var j = $("wd-ed-imagewizard-checkresult");
					j.innerHTML = '<p style="color: red">Not a valid input for the flickr.com image.</p>';
					return
				}
				b = "flickr:" + m;
				if (f) {
					b += "_" + f
				}
			}
		}
	}
	var n = "";
	var d = $("wd-ed-imagewizard-size");
	if (d) {
		n = d.value
	}
	if (n != "") {
		n = ' size="' + n + '"'
	}
	var g = $("wd-ed-imagewizard-position").value.replace(/l/, "<").replace(/r/, ">").replace(/c/, "=");
	var c = "[[" + g + "image " + b + n + "]]";
	WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentPos, WIKIDOT.Editor.currentPos);
	WIKIDOT.Editor.utils.insertText(c);
	OZONE.dialog.cleanAll()
};
WIKIDOT.Editor.listeners = {
	tableWizardInsert: function (h) {
		var g = $("wd-ed-tablewizard-rows").value;
		var f = $("wd-ed-tablewizard-columns").value;
		var k = $("wd-ed-tablewizard-headers").checked;
		var c = "";
		for (var d = 0; d < g; d++) {
			c += INSERT_NEWLINE + "||";
			for (var b = 0; b < f; b++) {
				if (d == 0 && k) {
					c += "~ header ||"
				} else {
					c += " cell-content ||"
				}
			}
		}
		WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentPos, WIKIDOT.Editor.currentPos);
		WIKIDOT.Editor.utils.insertText(c, WIKIDOT.Editor.utils.endWithAtLeast1NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine);
		OZONE.dialog.cleanAll()
	},
	uriWizardInsert: function (f) {
		var d = $("wd-ed-uriwizard-uri").value;
		var c = $("wd-ed-uriwizard-anchor").value;
		var g = $("wd-ed-uriwizard-newwindow").checked;
		var b = "";
		if (c == null || c == "") {
			if (g) {
				b += "*"
			}
			b += d
		} else {
			b = "[";
			if (g) {
				b += "*"
			}
			b += d + " " + c + "]"
		}
		WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentPos, WIKIDOT.Editor.currentPos);
		WIKIDOT.Editor.utils.insertText(b);
		OZONE.dialog.cleanAll()
	},
	pageLinkWizardInsert: function (f) {
		var b = $("wd-ed-pagelinkwizard-page").value;
		var d = $("wd-ed-pagelinkwizard-anchor").value;
		var c = "[[[" + b;
		if (d != null && d != "") {
			c += " |" + d
		}
		c += "]]]";
		WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentPos, WIKIDOT.Editor.currentPos);
		WIKIDOT.Editor.utils.insertText(c);
		OZONE.dialog.cleanAll()
	},
	codeWizardInsert: function (f) {
		var d = $("wd-ed-codewizard-type").value;
		var c = "[[code";
		if (d != "") {
			c += ' type="' + d + '"'
		}
		c += "]]" + INSERT_NEWLINE;
		var b = INSERT_NEWLINE + "[[/code]]";
		WIKIDOT.Editor.ranger.setSelectionRange(WIKIDOT.Editor.currentRange[0], WIKIDOT.Editor.currentRange[1]);
		WIKIDOT.Editor.utils.insertTags(c, b, "insert the code here", WIKIDOT.Editor.utils.trimSelection, WIKIDOT.Editor.utils.endWithAtLeast2NewLine, WIKIDOT.Editor.utils.startWithAtLeast2NewLine);
		OZONE.dialog.cleanAll()
	}
};
WIKIDOT.Editor.keyboardListener = function (f) {
	WIKIDOT.Editor.lastKeyCode = null;
	var d = YAHOO.util.Event.getCharCode(f);
	WIKIDOT.Editor.lastKeyCode = d;
	var b = "";
	if (f.ctrlKey == true) {
		b += "ctrl+"
	}
	if (f.altKey == true) {
		b += "alt+"
	}
	b += String.fromCharCode(d);
	if ($("editdebug")) {
		$j("#editdebug").html(d)
	}
	var c = WIKIDOT.Editor.keys[b];
	if (!c) {
		c = WIKIDOT.Editor.keyCodes[d]
	}
	if (c) {
		YAHOO.util.Event.preventDefault(f);
		c.call(null, f)
	}
};
WIKIDOT.Editor.codeAssist = {};
WIKIDOT.Editor.codeAssist.listener = function (c) {
	var b = WIKIDOT.Editor.lastKeyCode;
	if (b != 13) {
		return
	}
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.listEnd);
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.list);
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.listNested);
	WIKIDOT.Editor.codeAssist.rules.completeBlock();
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.definitionList);
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.keepIndent);
	WIKIDOT.Editor.utils.insertText("", WIKIDOT.Editor.codeAssist.rules.indentEnd)
};
WIKIDOT.Editor.codeAssist.rules = {};
WIKIDOT.Editor.codeAssist.rules.list = function (b) {
	b = b.replace(/((?:\r?\n|^)([\*#])\s.*?\r?\n)$/, "$1$2 ");
	return b
};
WIKIDOT.Editor.codeAssist.rules.definitionList = function (b) {
	b = b.replace(/(\r?\n:\s.+?\s:.*\r?\n)$/, "$1: ");
	return b
};
WIKIDOT.Editor.codeAssist.rules.listNested = function (b) {
	b = b.replace(/(\r?\n *[\*#]\s.+\r?\n( *)([\*#])\s.*?\r?\n)$/, "$1$2$3 ");
	return b
};
WIKIDOT.Editor.codeAssist.rules.listEnd = function (b) {
	b = b.replace(/((?:\r?\n|^)\s*[\*#:]\s.*?\r?\n)\s*[\*#:]\s\r?\n$/, "$1" + INSERT_NEWLINE);
	return b
};
WIKIDOT.Editor.codeAssist.rules.keepIndent = function (b) {
	b = b.replace(/(\r?\n(\t+).+\r?\n)$/, "$1$2");
	return b
};
WIKIDOT.Editor.codeAssist.rules.indentEnd = function (b) {
	b = b.replace(/(\r?\n(\t+)\r?\n)$/, INSERT_NEWLINE + INSERT_NEWLINE);
	return b
};
WIKIDOT.Editor.codeAssist.rules.completeBlock = function () {
	var g = $(WIKIDOT.Editor.editElementId);
	var f = g.scrollTop;
	var c = WIKIDOT.Editor.ranger;
	var b = c.getSelectionRange();
	var e = g.value.substring(0, b[1]);
	var h = g.value.substring(b[1], g.value.length);
	var d = e.length;
	e = e.replace(/(\[\[(code|embedvideo|math|embed)(?:\s[^\]]*?)?\]\]\r?\n)$/, "$1" + INSERT_NEWLINE + "[[/$2]]");
	g.value = e + h;
	var j = d;
	c.setSelectionRange(j, j);
	g.scrollTop = f
};
WIKIDOT.Editor.codeAssist.rules.completeBlockPost = function (b) {};
WIKIDOT.Editor.keys = new Object();
WIKIDOT.Editor.keys["ctrl+b"] = WIKIDOT.Editor.buttons.bold;
WIKIDOT.Editor.keys["ctrl+i"] = WIKIDOT.Editor.buttons.italic;
WIKIDOT.Editor.keys["ctrl+u"] = WIKIDOT.Editor.buttons.underline;
WIKIDOT.Editor.keyCodes = new Object();
WIKIDOT.Editor.keyCodes[9] = function (b) {
	WIKIDOT.Editor.utils.insertText("\t");
	YAHOO.util.Event.stopEvent(b)
};
WIKIDOT.Editor.utils = {};
WIKIDOT.Editor.utils.insertTags = function (g, n, e, r, m, b, s) {
	var q = $(WIKIDOT.Editor.editElementId);
	q.focus();
	var d = WIKIDOT.Editor.ranger;
	d.trimSelection();
	var l = d.getSelectionRange();
	var f = q.scrollTop;
	var k = q.value.substring(0, l[0]);
	if (m) {
		k = m.call(null, k)
	}
	var t = q.value.substring(l[1], q.value.length);
	if (b) {
		t = b.call(null, t)
	}
	if (l[0] != l[1]) {
		var h = q.value.substring(l[0], l[1]);
		if (r) {
			h = r.call(null, h)
		}
		q.value = k + g + h + n + t;
		var j = q.value.length - t.length;
		d.setSelectionRange(j, j)
	} else {
		q.value = k + g + e + n + t;
		if (!s) {
			var o = k.length + g.length;
			var c = o + e.length;
			d.setSelectionRange(o, c)
		} else {
			var j = q.value.length - t.length;
			d.setSelectionRange(j, j)
		}
	}
	q.focus();
	q.scrollTop = f
};
WIKIDOT.Editor.utils.insertText = function (c, d, b) {
	WIKIDOT.Editor.utils.insertTags("", "", c, null, d, b, true);
	return
};
WIKIDOT.Editor.utils.trimSelection = function (b) {
	return b.replace(/^\s+/, "").replace(/\s+$/, "")
};
WIKIDOT.Editor.utils.endWithNewLine = function (b) {
	return b.replace(/[\s\r\n]+$/, "") + INSERT_NEWLINE
};
WIKIDOT.Editor.utils.endWithAtLeast1NewLine = function (b) {
	return b.replace(/\r?\n$/, "") + INSERT_NEWLINE
};
WIKIDOT.Editor.utils.startWithNewLine = function (b) {
	return INSERT_NEWLINE + b.replace(/^[\s\r\n]+/, "")
};
WIKIDOT.Editor.utils.startWithAtLeast1NewLine = function (b) {
	if (b.length == 0) {
		return b
	}
	return INSERT_NEWLINE + b.replace(/^\r?\n/, "")
};
WIKIDOT.Editor.utils.startWithAtLeast2NewLine = function (b) {
	if (b.length == 0) {
		return b
	}
	return INSERT_NEWLINE + INSERT_NEWLINE + b.replace(/^\r?\n(\s*\r?\n)?/, "")
};
WIKIDOT.Editor.utils.endWithAtLeast2NewLine = function (b) {
	if (b.length == 0) {
		return b
	}
	return b.replace(/(\r?\n\s*)?\r?\n$/, "") + INSERT_NEWLINE + INSERT_NEWLINE
};
WIKIDOT.Editor.utils.endWith2NewLine = function (b) {
	if (b.length == 0) {
		return b
	}
	return b.replace(/[\s\r\n]+$/, "") + INSERT_NEWLINE + INSERT_NEWLINE
};
WIKIDOT.Editor.utils.startWith2NewLine = function (b) {
	return INSERT_NEWLINE + INSERT_NEWLINE + b.replace(/^[\s\r\n]+/, "")
};
WIKIDOT.Editor.utils.processQuoteText = function (b) {
	var b = b.replace(/^\s+/, "").replace(/\s+$/, "");
	b = b.replace(/\r?\n/g, INSERT_NEWLINE + "> ");
	return b
};
WIKIDOT.Editor.utils.processNumberedList = function (b) {
	var b = b.replace(/^\s+/, "").replace(/\s+$/, "");
	b = b.replace(/\r?\n/g, INSERT_NEWLINE + "# ");
	return b
};
WIKIDOT.Editor.utils.processBulletedList = function (b) {
	var b = b.replace(/^\s+/, "").replace(/\s+$/, "");
	b = b.replace(/\r?\n/g, INSERT_NEWLINE + "* ");
	return b
};
WIKIDOT.Editor.utils.increaseListIndent = function (b) {
	if (b.match(/\r?\n(\s*)[\*#].*\r?\n(\1)\s+[\*#].*$/)) {
		return b
	}
	return b.replace(/(\r?\n\s*[\*#].*)(\r?\n\s*)([\*#].*)$/, "$1$2 $3")
};
WIKIDOT.Editor.utils.decreaseListIndent = function (b) {
	return b.replace(/(\r?\n\s*) ([\*#].*)$/, "$1$2")
};
TextElementProxyUtil = function (b, c) {
	this.field = $(b);
	this.detectBrowser(c)
};
TextElementProxyUtil.prototype.detectBrowser = function (d) {
	if (YAHOO.env.ua.gecko || ((this.field.selectionStart || this.field.selectionStart == 0) && (!YAHOO.env.ua.ie || YAHOO.env.ua.ie >= 10))) {
		this.browserType = "gecko"
	} else {
		var c,
		b;
		if (d) {
			c = document.createElement("textarea");
			c.style.position = "absolute";
			c.style.top = "0";
			c.style.left = "-1000px";
			b = document.getElementsByTagName("body").item(0);
			b.appendChild(c)
		} else {
			c = this.field
		}
		c.focus();
		if (document.selection.createRange) {
			this.browserType = "ie";
			INSERT_NEWLINE = "\r\n"
		}
		if (d) {
			b.removeChild(c)
		}
	}
};
TextElementProxyUtil.prototype.getCursorPosition = function () {
	var b = this.getSelectionRange();
	return b[1]
};
TextElementProxyUtil.prototype.getSelectionRange = function () {
	var d;
	var c;
	this.field.focus();
	if (this.browserType == "gecko") {
		d = this.field.selectionStart;
		c = this.field.selectionEnd
	}
	if (this.browserType == "ie") {
		if (document.selection) {
			var b = document.selection.createRange();
			var e = b.duplicate();
			e.moveToElementText(this.field);
			e.setEndPoint("StartToStart", b);
			d = this.field.value.length - e.text.length;
			c = d + b.text.length
		}
	}
	this.field.focus();
	return [d, c]
};
TextElementProxyUtil.prototype.setSelectionRange = function (d, c) {
	this.field.focus();
	if (this.browserType == "gecko") {
		this.field.setSelectionRange(d, c)
	}
	if (this.browserType == "ie") {
		var e = this.field.value.substring(0, d);
		var f = this.field.value.substring(d, c);
		d = e.replace(/\r\n/g, "\n").length;
		c = d + f.replace(/\r\n/g, "\n").length;
		var b = this.field.createTextRange();
		b.collapse(true);
		b.moveEnd("character", c);
		b.moveStart("character", d);
		b.select()
	}
	this.field.focus()
};
TextElementProxyUtil.prototype.trimSelection = function () {
	var c = this.getSelectionRange();
	var e = this.field.value.substring(c[0], c[1]);
	var d = e.length - e.replace(/^\s+/, "").length;
	var b = e.length - e.replace(/\s+$/, "").length;
	this.setSelectionRange(c[0] + d, c[1] - b)
};
jQuery(document).ready(function () {
	jQuery(document).unbind("keydown").bind("keydown", "ctrl+e", function (b) {
		WIKIDOT.page.listeners.editClick(b);
		return false
	})
});
function keyBindSavePage() {
	jQuery(document).unbind("keydown").bind("keydown", "backspace", function (b) {
		if (/textarea|input/i.test(b.target.nodeName) == false) {
			return false
		}
	});
	jQuery(document).unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.PageEditModule.listeners.save(b);
		return false
	})
}
function keyBindNewPost() {
	jQuery("form#new-post-form").unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.ForumNewPostFormModule.listeners.save(b);
		return false
	})
}
function keyBindEditPost() {
	jQuery("form#edit-post-form").unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.ForumEditPostFormModule.listeners.save(b);
		return false
	})
}
function keyBindNewThread() {
	jQuery("form#new-thread-form").unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.ForumNewThreadModule.listeners.post(b);
		return false
	})
}
function keyBindEditThread() {
	jQuery("form#thread-meta-form").unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.ForumEditThreadMetaModule.listeners.save(b);
		return false
	})
}
function keyBindSendPM() {
	jQuery("form#new-pm-form").unbind("keydown").bind("keydown", "ctrl+s", function (b) {
		WIKIDOT.modules.DMNewMessageModule.listeners.send(b);
		return false
	})
};
