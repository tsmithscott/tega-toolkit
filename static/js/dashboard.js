var current_game = {};
var sections;
var characteristics;
var models;
var gameName;
var update;
var complete_status;
var cleanDashboardClone;

$.ajax({
	url: '/get_sections',
	type: 'GET',
	success: function(response) {
		sections = response['sections'];
	},
	error: function(error) {
		throw new Error(error);
	},
	async: false
});

$.ajax({
	url: '/get_characteristics',
	type: 'GET',
	success: function(response) {
		characteristics = response;
	},
	error: function(error) {
		throw new Error(error);
	},
	async: false
});

$.ajax({
	url: '/get_model',
	type: 'GET',
	success: function(response) {
		models = response;
	},
	error: function(error) {
		throw new Error(error);
	},
	async: false
});

$(document).ready(function() {
	populateCharacteristicsDropdown();
	populateModelDropdown();
	cleanDashboardClone = $("#dashboard-container-right").clone();

	let game_id = getCookie("_game_id");
	$("#form-copy-link").append(game_id);

	disableBodyScroll();
});

$(document).on("click", ".fa-trash", function() {
	let dataid = $(this).data('id');
	$("#modal-data-id").val(dataid);
})

$(document).on("click", ".fa-file-download", function() {
	let dataid = $(this).data('id');
	let pdf_url = "/download-game-pdf/" + dataid;
	let json_url = "/download-game-json/" + dataid;

	$("#pdf-download-option").attr("href", pdf_url);
	$("#json-download-option").attr("href", json_url);
})

$(document).on("click", "#justification-submit-anonymous", function() {
	let gameid = getCookie("_game_id");
	let json_url = "/download-game-json/" + gameid;
	let form_url = "/download-game-forms/" + gameid;

	$("#json-download-option").attr("href", json_url);
	$("#form-download-button").attr("href", form_url);
})

function downloadJSON() {
	let url = "/download-game-json/" + getCookie("_game_id");

	$.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify({"game_data": localStorage.getItem("_game_data")}),
		contentType: "application/json",
		success: function(result) {
			console.log(result);
			var blob=new Blob([result], {type: 'text/plain'});
			var link=document.createElement('a');
			link.href=window.URL.createObjectURL(blob);
			link.download=getCookie("_game_id") + ".json";
			link.click();
		},
		error: function(result) {
			return;
		}
	})
}

$("#upload-game-form").submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: "/upload-game",
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData:false,
        success: function(data) {
            console.log("Successful upload");
			location.reload();
        },
        error: function(data) {
            console.log("Error uploading game");
        }
    });
});

function logout() {
	current_game = {};
	deleteCookie("_game_id");
	deleteCookie("_latest_section");
	deleteCookie("_user_id");
	localStorage.removeItem("_game_data");

	$.ajax({
		type: 'GET',
		url: '/logout',
		success: function(data) {
			$(location).attr("href", "/");
		},
		error: function(data) {
			alert('Error occured while logging out. Try again or please contact support')
		}
	});
}

function importGame() {
	console.log($('#upload-game-form')[0]);
	var form_data = new FormData($('#upload-game-form')[0]);
	$.ajax({
		type: 'POST',
		url: '/upload-game',
		data: form_data,
		contentType: false,
		cache: false,
		processData: false,
		success: function(data) {
			console.log('Success!');
		},
	});
}

function loadMostRecentGame() {
	$("#dashboard-saved-games").find(".list-group-item").first().find("a").first().click();
	$("#load-most-recent-game-button").hide();
	$("#import-game-button").hide();
	$("#page-switch-button").show();
}

function deleteGame() {
	$.ajax({
		url: '/delete_game/' + $('#modal-data-id').val(),
		type: 'POST',
		success: function(response) {
			location.reload();
		},
		error: function(error) {
			throw new Error(error);
		},
		async: false
	});
}

function disableBodyScroll() {
	$("body").css("overflow-y", "hidden");
}

$(".accessibilityTextarea").keyup(function() {
	if (!$(this).val()) {
		$(this).removeClass("selected");
	} else {
		$(this).addClass("selected");
	}
})

function toggleSubmeasure(input) {
	if ($(input).hasClass("selected")) {
		$(input).removeClass("selected");
	} else {
		$(input).addClass("selected");
	}

	var measure = $(input).val().split("-")[0];
	toggleMeasure(measure);
}

function toggleMeasure(measure) {
	if ($("#" + measure + "-collapse").find("ul").find(".selected").length > 0) {
		$("#" + measure + "-button-dropdown").addClass("green");
	} else {
		$("#" + measure + "-button-dropdown").removeClass("green");
	}
}

function toggleSelection(input) {
	if ($(input).attr("type") === "checkbox") {
		textarea_td = $(input).closest("td").next();
		textarea = $(textarea_td).find("textarea");
		textarea.val("");
		textarea.attr("disabled", !textarea.attr("disabled"));
		textarea.removeClass("selected");

		if ($(input).hasClass("selected")) {
			$(input).removeClass("selected");
		} else {
			$(input).addClass("selected");
		}
	} else if ($(input).hasClass("green")) {
		$(input).removeClass("green");
		$(input).removeAttr("selected");

		if ($(input).closest("div").attr("id") === "typology-content") {
			$(input).closest("td").siblings().children().find("button").removeAttr("disabled");
		}
	} else {
		$(input).addClass("green");
		$(input).attr("selected", "selected");

		if ($(input).closest("div").attr("id") === "typology-content") {
			$(input).closest("td").siblings().children().find("button").attr("disabled", "disabled");
		}
	}
};

function toggleModelSelection(input) {
	if ($(input).hasClass("selected")) {
		$(input).removeClass("selected");
	} else {
		$(input).addClass("selected");
	}

	var cols = [];
	cols.push($(input).closest(".col-4")[0]);
	cols.push($(input).closest(".col-4").siblings()[0]);
	cols.push($(input).closest(".col-4").siblings()[1]);
	
	for (let col of cols) {
		if (!$(col).find(".selected").length >= 1) {
			cols.pop(col)
		}
	}

	if (cols.length === 3) {
		$(input).closest(".accordion-collapse").prev().find("button").first().addClass("green");
		$(input).closest(".accordion-collapse").prev().find("button").first().addClass("selected");
	} else {
		$(input).closest(".accordion-collapse").prev().find("button").first().removeClass("green");
		$(input).closest(".accordion-collapse").prev().find("button").first().removeClass("selected");
	}
}

function addGameFormLink() {
	let base_url = $("#form-copy-link").next().attr("baseurl");
	let game_id = getCookie("_game_id");
	let combined = base_url + '/form/' + game_id;
	$("#form-copy-link").html(combined);
	$("#form-copy-link").attr("href", combined);
}

function processSection(sectionID) {

	let section_game = {};
	let section = $("#" + sectionID + "-content")


	// Introduction
	if (sectionID === "introduction") {
		processGameData(false, sectionID);
		unlockNextSection(sectionID);


	// Theoretical Foundation
	} else if (sectionID ===  "foundation") {
		processGameData(false, sectionID);
		unlockNextSection(sectionID);


	// Theoretical Model
	} else if (sectionID === "model") {
		if ($("#model-content").find(".btn-primary.accordion-button").length > 0) {
			let thinking_skills = $("#model-content").find(".btn-primary.accordion-button");

			let section_game = {};

			for (let skill of thinking_skills) {
				if (!$(skill).hasClass("selected")) {
					$("#model-content").find(".errorMessage").attr("hidden", "hidden");
					$("#model-content").find(".errorSubMessage").removeAttr("hidden");
					return;
				}
			}

			for (let skill of thinking_skills) {
				let thinking_skill = $(skill).attr("id").split("-")[0];
				let cols = $(skill).closest("h2").next().find(".col-4");

				let learning_mechanics = [];
				let game_mechanics = [];
				let rule_designs = [];
				
				for (let selection of $(cols[0]).find(".selected")) {
					learning_mechanics.push($(selection).val().split(/-(.*)/s)[1]);
				}

				for (let selection of $(cols[1]).find(".selected")) {
					game_mechanics.push($(selection).val().split(/-(.*)/s)[1]);
				}

				for (let selection of $(cols[2]).find(".selected")) {
					rule_designs.push($(selection).val().split(/-(.*)/s)[1]);
				}

				section_game[thinking_skill] = {
					"learning_mechanics": learning_mechanics,
					"game_mechanics": game_mechanics,
					"rule_designs": rule_designs
				}
			}

			current_game[sectionID] = section_game;
			save = processGameData(false, sectionID);
			if (save) {
				unlockNextSection(sectionID);
			} else {
				alert("unable to save progress. Please contact support.");
			}

		} else {
			$("#model-content").find(".errorSubMessage").attr("hidden", "hidden");
			$("#model-content").find(".errorMessage").removeAttr("hidden");
		}


	// Characteristics
	} else if (sectionID === "characteristics") {

		var selections = $("#" + sectionID + "-content-accordion-row").find(".accordion-button").map(function() {
			return this.id.split("-")[0];
		}).get();
		
		if (selections.length < 1) {
			section.find(".errorMessage").removeAttr("hidden");
			return;
		} else {
			section.find(".errorMessage").attr("hidden", "");
			for (let selection of selections) {
				if ($("#" + selection + "-collapse").find("ul").find(".selected").length > 0) {
						let submeasures = [];
						for (let submeasure of $("#" + selection + "-collapse").find("ul").find(".selected")) {
						let submeasure_string = $(submeasure).val().split("-")[1];
						submeasures.push(submeasure_string);
						}
						section_game[selection] = submeasures;
				} else {
					section.find(".errorSubMessage").removeAttr("hidden");
					return;
				}
			}

			current_game[sectionID] = section_game;
			save = processGameData(false, sectionID);
			if (save) {
				selections = [];
				unlockNextSection(sectionID);
			} else {
				alert("unable to save progress. Please contact support.");
			}
		}


	// Clean Slate Game
	} else if (sectionID === "slate") {
		let textarea = section.find("textarea");

		if (textarea.val().length > 0) {
			current_game[sectionID] = textarea.val();
		}


		save = processGameData(false, sectionID);
		if (save) {
			selections = [];
			unlockNextSection(sectionID);
		} else {
			alert("Unable to save progress. Please contact support.");
		}


	// Inclusivity and Accessibility
	} else if (sectionID === "accessibility") {
		let checked_checkboxes = section.find("input:checkbox").map(function() {
			return $(this).hasClass("selected") ? $(this) : null;
		}).get();

		let unchecked_checkboxes = section.find("input:checkbox").map(function() {
			return $(this).hasClass("selected") ? null : $(this);
		}).get();

		if (section.find(".selected").length < 1) {
			section.find(".errorMessage").removeAttr("hidden");
		} else {
			section.find(".errorMessage").attr("hidden");
		}

		if ($("#accessibility-content textarea.selected").length > 18) {
			$("#accessibility-content").find(".errorMessage").attr("hidden", "hidden");

			let considered = [];
			for (let checkbox of checked_checkboxes) {
				considered.push(checkbox.val());
			}
			section_game["considered"] = considered;

			for (let checkbox of unchecked_checkboxes) {
				let subsection = checkbox.val();
				let reason = $(checkbox).closest("td").next().find("textarea").val();
				if (reason.length > 0) {
					section_game[subsection] = reason;
				}
			}

			current_game[sectionID] = section_game;
			save = processGameData(false, sectionID);
			if (save) {
				unlockNextSection(sectionID);
			} else {
				alert("Unable to save progress. Please contact support.");
			}
		} else {
			$("#accessibility-content").find(".errorMessage").removeAttr("hidden");
			return;
		}

	// Flow Element of the Design
	} else if (sectionID === "design") {
		let fields = section.find("textarea").map(function() {
			return $(this).val().length > 0 ? this : null;
		}).get();

		for (let field of fields) {
			let subsection_td = $(field).parent().siblings()[0];
			let subsection = $(subsection_td).html();
			if (subsection === "Assessment1") subsection = "Assessment";
			section_game[subsection] = $(field).val() + ($(field).hasClass('tools') ? "_tools" : "_reason");
		}

		current_game[sectionID] = section_game;
		save = processGameData(false, sectionID);
		if (save) {
			unlockNextSection(sectionID);
		} else {
			alert("Unable to save progress. Please contact support.");
		}


	// Drafting Game Instructions
	} else if (sectionID === "instruction") {
		let inputs = section.find("textarea").map(function() {
			return $(this).val().length > 0 ? this : null;
		}).get();

		for (let input of inputs) {
			let previous = $(input).parent().siblings()[0];
			let subsection = $(previous).html();
			section_game[subsection] = $(input).val();
		}
		

		current_game[sectionID] = section_game;
		save = processGameData(false, sectionID);
		if (save) {
			unlockNextSection(sectionID);
		} else {
			alert("Unable to save progress. Please contact support.");
		}


	// Game Playability
	} else if (sectionID === "playability") {
		let section_game = [];
		let trs = $("#playability-content").find('tr');

		trs.splice(0, 2);

		for (let tr of trs) {
			let subsection = [];

			for (let td of $(tr).children()) {
				subsection.push($(td).children().first().val());
			}

			section_game.push(subsection);
		}

		current_game[sectionID] = section_game;
		save = processGameData(false, sectionID);
		if (save) {
			unlockNextSection(sectionID);
			addGameFormLink();
		} else {
			alert("Unable to save progress. Please contact support.");
		}


	// Assessment
	} else if (sectionID === "assessment") {
		if ($("#game-name").length && $("#game-name").val().length > 0) {
			nameGame()
		}
		processGameData(false, sectionID);
		unlockNextSection(sectionID);


	// Justification
	} else if (sectionID === "justification") {
		save = processGameData(true, sectionID);
		
		if (save) {
			unlockNextSection(sectionID);
			toggleDashboardPage();
		} else {
			alert("Unable to save progress to the database. Please contact support.");
		}


	// If section is Profile, and other sections
	} else {
		var selections = section.find(".green").map(function() {
			return this.id.split("-")[2];
		}).get();

		if (selections.length < 1) {
			section.find(".errorMessage").removeAttr("hidden");
			return;
		} else {
			section.find(".errorMessage").attr("hidden", "");

			current_game[sectionID] = [];
			current_game[sectionID] = selections;
			save = processGameData(false, sectionID);
			if (save) {
				selections = [];
				unlockNextSection(sectionID);
			} else {
				alert("Unable to save progress. Please contact support.");
			}
		}
	}
}


// Update the latest section in the game data
function processLatestSection(latestSection) {
	let status = '';
	$.ajax({
		url: '/ajax-update-section',
		data: {"section": latestSection, "gameid": getCookie("_game_id")},
		type: 'POST',
		success: function(response) {
			status = true;
		},
		error: function(error) {
			status = false;
	  	},
		async: false
	});
	return status;
}


function processGameData(complete, section) {
	let saved = '';
	let url = '/ajax-autosave';
	deleteCookie("_game_data");

	if (update) {
		complete = complete_status;
	}
	$.ajax({
		url: url,
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify({current_game, "complete":complete, "gameuuid": getCookie("_game_id"), "latestsection": section}),
		type: 'POST',
		success: function(response) {
			let data = JSON.parse(JSON.stringify(response));
			localStorage.setItem("_game_data", data["_game_data"]);
			setCookie("_game_id", data["_game_id"]);
			saved = true;
		},
		error: function(error) {
			saved = false;
	  	},
		async: false
	});
	return saved;
}


// Load game data from database
function loadGame(edit_button) {
	let dataid = $(edit_button).data('id');
	let url = '/get_game/' + dataid;
	
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response) {
			update = true;
			complete_status = response['complete'];
			gameName = response['name'];

			localStorage.setItem("_game_data", response['game']);
			setCookie("_latest_section", response['latest_section']);
			setCookie("_game_id", response['id']);

			loadGameData();
			toggleDashboardPage();
			$("#load-most-recent-game-button").hide();
			$("#import-game-button").hide();
			$("#page-switch-button").show();

		},
		error: function(error) {
			saved = false;
	  	},
		async: false
	});
}


// Load game data from cookie
function loadGameData() {
	let latestSection = "introduction";

	let gameDataCookie = localStorage.getItem("_game_data");

	let latestSectionCookie = getCookie("_latest_section");

	if (gameDataCookie !== null) {
		current_game = parseJWT(gameDataCookie);
 
		if (latestSectionCookie !== null) {
			latestSection = parseJWT(latestSectionCookie)["section"];
		} else {
			localStorage.removeItem("_game_data");
		}
	}

	removeAllStyling();

	switch (latestSection) {
		case('introduction'):
			addStyling('#introduction');
			break;
		case('profile'):
			addStyling('#profile');
			break;
		case('typology'):
			addStyling('#typology');
			break;
		case('characteristics'):
			addStyling('#characteristics');
			break;
		case('foundation'):
			addStyling('#foundation');
			break;
		case('model'):
			addStyling('#model');
			break;
		case('slate'):
			addStyling('#slate');
			break;
		case('accessibility'):
			addStyling('#accessibility');
			break;
		case('design'):
			addStyling('#design');
			break;
		case('instruction'):
			addStyling('#instruction');
			break;
		case('playability'):
			addStyling('#playability');
			break;
		case('assessment'):
			addStyling('#assessment');
			break;
		case('justification'):
			addStyling('#justification');
			break;
	}

	addGameDataStyling();
}


function parseJWT(jwt) {
	let data = '';

	$.ajax({
		url: '/ajax-parse',
		data: {"jwt": jwt},
		type: 'POST',
		success: function(response) {
			data = response;
		},
		error: function(error) {
			return false;
	  	},
		async: false
	});
	return data;
}


// Set all dashboard card component styling to default/disabled/hidden
function removeAllStyling() {
	$('.list-group-item.list-group-item-action.dashboard-section').removeClass('active').removeAttr('aria-current');
	$('.list-group-item.list-group-item-action.dashboard-section').attr('disabled', true).css('background-color', 'lightgray');
	$('.list-group-item.list-group-item-action.dashboard-section').children().val(0);
	$('.dashboard-content').hide();
}


// Helper function to add styling to sections on page load
// Uses cookie data to determine which sections to add styling to
function addStyling(latestSection) {
	let no_previous_sections = sections.indexOf(latestSection.split("#")[1]);

	for (let i = 0; i < no_previous_sections; i++) {
		$('#' + sections[i]).removeAttr('disabled style');
		$('#' + sections[i]).children().val(1);
	}

	$('#progress-bar').attr('aria-valuenow', (no_previous_sections) * 8.33333333333).css('width', (no_previous_sections) * 8.33333333333 + '%');
	$(latestSection).removeAttr('disabled style').addClass('active').attr('aria-current', 'true');
	$(latestSection).children().val(1);
	$(latestSection + '-content').scrollTop(0);
	$(latestSection + '-content').show();
}


// Helper function to add styling to section inputs on page load
function addGameDataStyling() {
	// Keys for each section with gamedata
	let gameData = localStorage.getItem("_game_data") !== null ? parseJWT(localStorage.getItem("_game_data")) : [];
	let section_keys = Object.keys(gameData);
	
	if (section_keys.length > 0) {
		for (let i = 0; i < section_keys.length; i++) {
			section = section_keys[i];
			switch(section) {
				case('introduction'):
				case('foundation'):
					break;
					
				case('profile'):
				case('typology'):
					for (selection_index in gameData[section]) {
						let selection = gameData[section][selection_index];
						let button = $('#' + section + '-content-' + selection)
						let opposite_button = button.closest('td').siblings().first().find('button')
						button.addClass('green').attr('selected', 'selected');
						opposite_button.attr('disabled', 'disabled');
					}
					break;

				case('characteristics'):
					for (subsection in gameData[section]) {
						processCharacteristicMeasure($('#' + subsection));
						$('#' + subsection + '-button-dropdown').addClass('green');
						let characteristics = gameData[section][subsection];

						for (characteristic_index in characteristics) {
							let characteristic = characteristics[characteristic_index].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
							$('#' + characteristic).prop('checked', true);
							$('#' + characteristic).addClass('selected');
						}
					}
					break;

				case('model'):
					let thinking_skills = Object.keys(gameData[section])
					let i = 0;
					for (let skill of thinking_skills) {
						processModelMeasure("#" + skill);

						let accordion_body = $('#model-thinking-skill-col').find('.accordion-collapse').find('.accordion-body');
						let cols = $(accordion_body[i]).find('.col-4');
						
						let learning_mechanics = gameData[section][skill]["learning_mechanics"];
						let game_mechanics = gameData[section][skill]["game_mechanics"];
						let rule_designs = gameData[section][skill]["rule_designs"]

						for (let mechanic of learning_mechanics) {
							let id = "[id='Learningmechanics-" + mechanic + "']";
							$(cols[0]).find(id).attr("checked", true);
							$(cols[0]).find(id).addClass("selected");
						}

						for (let mechanic of game_mechanics) {
							let id = "[id='Gamemechanics-" + mechanic + "']";
							$(cols[1]).find(id).attr("checked", true);
							$(cols[1]).find(id).addClass("selected");
						}

						for (let mechanic of rule_designs) {
							let id = "[id='Gameruledesigns-" + mechanic + "']";
							$(cols[2]).find(id).attr("checked", true);
							$(cols[2]).find(id).addClass("selected");
						}

						$("#" + skill + "-button-dropdown").addClass("green").addClass("selected");
						i++;
					}
					
					break;

				case('slate'):
					$('textarea#slate-content-notes').text(gameData[section]);
					break;

				case('accessibility'):
					$('#accessibility-content').find('input[type="checkbox"]').each(function() {
						let textarea = $(this).closest('td').next().find('textarea')
						if (gameData[section]["considered"].includes($(this).val())) {
							$(this).prop('checked', true);
							$(this).addClass('selected');
							textarea.attr('disabled', 'disabled');
							textarea.text("");
						} else {
							textarea.text(gameData[section][$(this).val()]);
							textarea.addClass("selected");
						}
					});
					break;

				case('design'):
					let section_content = $('#design-content')
					for (subsection in Object.keys(gameData['design'])) {
						subsection = Object.keys(gameData['design'])[subsection];
						
						let textarea_data = gameData['design'][subsection];
						let text = textarea_data.split('_')[0];
						let identifier = textarea_data.split('_')[1];
						
						if (subsection === "Assessment") {
							subsection = "Assessment1"
						}
						let subsection_td = $(section_content).find('#' + subsection.replace(/[^\w\s]/gi, '').replace(/\s+/g, ''));
						let tools = $(subsection_td.next().children()[0]);
						let reasoning = $(subsection_td.next().next().children()[0]);
						
						if (identifier === "tools") {
							tools.val(text);
							reasoning.removeAttr('required').attr('disabled', 'disabled');
						} else if (identifier === "reason") {
							reasoning.val(text);
							tools.removeAttr('required').attr('disabled', 'disabled');
						}
					}
					break;

				case('instruction'):
					let tbody = $('#instruction-content').find('tbody');

					for (instruction in Object.keys(gameData['instruction'])) {
						instruction = Object.keys(gameData['instruction'])[instruction];
						td = $(tbody).find('td:contains("' + instruction + '")');
						textarea = $(td).next().children()[0];
						$(textarea).val(gameData['instruction'][instruction]);
					}
					break;

				case('playability'):
					let tablebody = $('#playability-content').find('tbody');
					let empty_row = $(tablebody).children().first()[0];
					empty_row = $(empty_row).children();
					let rows = gameData['playability'].reverse();

					for (let row of rows) {
						for (let td_data in row) {
							$(empty_row[td_data]).children().first().val(row[td_data]);
						}
						createPlayabilityRow($(empty_row[0]).children().first(), true);
					}
					break;
			}
		}
		// Add assessment link
		addGameFormLink();
	}
}


// Helper function to increment progress bar
function incrementProgressBar() {
	let progress = parseInt($('#progress-bar').attr('aria-valuenow')) + 8.33333333333; // Increment progress bar value
	$('#progress-bar').attr('aria-valuenow', progress).css('width', progress + '%'); // Update progress bar
}


// Helper function to unlock next section when a section is completed
// Applies styling to the current/next section buttons and content sections
function unlockNextSection(currentSection) {
	let currentSectionButton = $('#' + currentSection);
	let currentSectionContent = $('#' + currentSection + '-content');

	let nextSectionButton = $('#' + currentSection).next();
	let nextSectionContent = $('#' + currentSection + '-content').next();
	
	// If the next section is not the last section
	if (nextSectionButton.length !== 0) {
		if (nextSectionButton.children().val() == 0) {
			currentSectionButton.removeClass('active').removeAttr('aria-current');
			nextSectionButton.removeAttr('disabled style');

			nextSectionButton.children().val(1);

			nextSectionButton.addClass('active').attr('aria-current', 'true');
			currentSectionContent.hide();
			nextSectionContent.scrollTop(0);
			nextSectionContent.show()

			processLatestSection(nextSectionButton.attr('id'));

			incrementProgressBar();
		} else {
			// Change button styling
			currentSectionButton.removeClass('active').removeAttr('aria-current');
			nextSectionButton.addClass('active').attr('aria-current', 'true')
			// Change content section
			currentSectionContent.hide();
			nextSectionContent.scrollTop(0);
			nextSectionContent.show();
		}
	// If the next section is the last section
	} else {
		$("#dashboardGameModalDownload").modal('show');
		$('#progress-bar').attr('aria-valuenow', 100).css('width', 100 + '%');
	}
}


// Handle dashboard list button clicks
$('.list-group-item.dashboard-section').click(function() {
	let currentButton = $('.list-group-item.list-group-item-action.active');
	let clickedButton = $(this);
	let clickedButtonContent = clickedButton.attr('id') + '-content';
	$('.dashboard-content').hide(); // Hide all content sections
	$('#' + clickedButtonContent).scrollTop(0); // Scroll to top of clicked content section
	$('#' + clickedButtonContent).show(); // Show clicked content section
	currentButton.removeClass('active').removeAttr('aria-current'); // Remove active styling from previous button
	clickedButton.addClass('active').attr('aria-current', 'true') // Add styling to clicked button
});


// Populate dropdown options for 'Game Characteristics' section on click
function populateCharacteristicsDropdown() {
	let characteristics_keys = Object.keys(characteristics);
	let no_characteristics = characteristics_keys.length;
	for (let i = 0; i < no_characteristics; i++) {
		$("#characteristics-content-add-dropdown-button").siblings().append('<li id="'+ characteristics_keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '') +'" onclick=processCharacteristicMeasure(this)><a class="dropdown-item" href="#">' + characteristics_keys[i] + '</a></li>')
	}
};


// Handle main dropdown option clicks in 'Game Characteristics' section
function processCharacteristicMeasure(characteristic) {
	let unprocessed_keys = Object.keys(characteristics);
	let keys = Object.keys(characteristics);
	for (let i = 0; i < keys.length; i++) {
		keys[i] = keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		if (keys[i] === $(characteristic).attr('id')) {
			createCharacteristicsSubmeasureDropdown(keys[i], unprocessed_keys[i]);
		}
	}
	$(characteristic).remove();
}


	
// Create submeasure dropdowns for 'Game Characteristics' section when pressed
function createCharacteristicsSubmeasureDropdown(characteristic_for_id, characteristic) {
	$('#characteristics-content-accordion-row').prepend(`
	<div class="characteristics-content-accordion-${characteristic_for_id} mb-5 characteristic-accordion" style="text-align: left; max-height: 170px; padding:5px;">
		<div class="accordion-item">
			<h2 class="accordion-header" id="headingOne">
				<div class="btn-group d-flex" role="group" aria-label="Button group with nested dropdown">
					<button onclick="flipArrow(this)" id="${characteristic_for_id}-button-dropdown" class="btn btn-primary accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${characteristic_for_id}-collapse" aria-expanded="true" aria-controls="${characteristic_for_id}'-collapse">
						${characteristic}
						<span class="fas fa-angle-down"></span>
					</button>
					<button type="button" class="btn btn-danger btn-sm" style="text-align:center;" onclick=removeCharacteristicsSubmeasureDropdown("${characteristic_for_id}") aria-label="Close">
						<span style="font-size:15pt;" aria-hidden="true">&times;</span>
					</button>
				</div>
			</h2>
			<div id="${characteristic_for_id}-collapse" style="position:relative; top:-7px; max-height:130px; padding-bottom:15px;" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#characteristics-content-accordion-${characteristic_for_id}">
				<div class="accordion-body">
					<div class="card pr-5" style="margin-bottom: 0px; max-height: 150px; width:fit-content; overflow-y:auto; overflow-x:hidden;">
						<ul style="max-height:125px; padding-left:0px; position:relative; left: 5px"></ul>
					</div>
				</div>
			</div>
		</div>
	</div>`
	);
	for (submeasure in characteristics[characteristic]) {
		let sm = characteristics[characteristic][submeasure];
		sm = sm.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		$('#' + characteristic_for_id + '-collapse').find('ul').append('<li><div class="form-check"><input onchange="toggleSubmeasure(this)" class="form-check-input" type="checkbox" value="'+ characteristic_for_id + '-' + characteristics[characteristic][submeasure] +'" id="' + sm +'"><label class="form-check-label" style="color:black; padding-left: 5px;" for="' + sm + '">' + characteristics[characteristic][submeasure] + '</label></div></li>');
	}
}


function removeCharacteristicsSubmeasureDropdown(characteristic_for_id) {
	let unprocessed_keys = Object.keys(characteristics);
	let keys = Object.keys(characteristics);
	let characteristic;
	for (let i = 0; i < keys.length; i++) {
		keys[i] = keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		if (keys[i] === characteristic_for_id) {
			characteristic = unprocessed_keys[i];
		}
	}
	$('.characteristics-content-accordion-' + characteristic_for_id).remove();
	$("#characteristics-content-add-dropdown-button").siblings().append('<li id="'+ characteristic_for_id +'" onclick=processCharacteristicMeasure(this)><a class="dropdown-item" href="#">' + characteristic + '</a></li>');
}


// Populate dropdown options for 'Theoretical Model' section on click
function populateModelDropdown() {
	let models_keys = Object.keys(models);
	let no_models = models_keys.length;
	for (let i = 0; i < no_models; i++) {
		$("#model-content-add-dropdown-button").siblings().append('<li id="'+ models_keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '') +'" onclick="processModelMeasure(this);"><a class="dropdown-item" href="#">' + models_keys[i] + '</a></li>')
	}
};


// Handle main dropdown option clicks in 'Theoretical Model' section
function processModelMeasure(model) {
	let unprocessed_keys = Object.keys(models);
	let keys = Object.keys(models);
	for (let i = 0; i < keys.length; i++) {
		keys[i] = keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		if (keys[i] === $(model).attr('id')) {
			createModelsSubmeasureDropdown(keys[i], unprocessed_keys[i]);
		}
	}
	$(model).remove();
}


function flipArrow(accordion_button) {
	let arrow = $(accordion_button).find('span');
	$(arrow).toggleClass("flip")
}


// Create submeasure dropdowns for 'Game Characteristics' section when pressed
function createModelsSubmeasureDropdown(model_for_id, model) {
	$("#model-content-add-dropdown-row").prev().prev().children().first().append(`
	<div class="row model-content-accordion-${model_for_id}">
		<div class="col">
			<div class="centered-div">
				<div class="accordion-item" style="text-align: left;">
					<h2 class="accordion-header d-flex justify-content-center" id="headingOne">
						<div class="accordion-button btn-group d-flex" role="group" aria-label="Button group with nested dropdown">
							<button id="${model_for_id}-button-dropdown" onclick="flipArrow(this)" class="btn btn-primary accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${model_for_id}-collapse" aria-expanded="true" aria-controls="${model_for_id}-collapse" value="0">
								${model} 
								<span class="fas fa-angle-down"></span>
							</button>
							<button type="button" class="btn btn-danger btn-sm" style="text-align:center;" onclick="removeModelsSubmeasureDropdown('${model_for_id}')" aria-label="Close">
								<span style="font-size:15pt;" aria-hidden="true">&times;</span>
							</button>
						</div>
					</h2>
					<div id="${model_for_id}-collapse" style="position:relative; top:-8px;" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#model-content-accordion-${model_for_id}">
						<div class="accordion-body">
							<div class="card" style="width: auto; max-height: auto;">
								<div class="card-body">
									<div class="container-fluid">
										<div class="row">
											<div class="col-4 text-nowrap">
												<h5 style="color:black;">Learning Mechanics</h5>
												<ul style="max-height:200px; overflow-x:auto; overflow-y:auto; padding-left:0px; position:relative; left: 5px"></ul>
											</div>
											<div class="col-4 text-nowrap">
												<h5 style="color:black;">Game Mechanics</h5>
												<ul style="max-height:200px; overflow-x:auto; overflow-y:auto; padding-left:0px; position:relative; left: 5px"></ul>
											</div>
											<div class="col-4 text-nowrap">
												<h5 style="color:black;">Game Rule Designs</h5>
												<ul style="max-height:200px; overflow-x:auto; overflow-y:auto; padding-left:0px; position:relative; left: 5px"></ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`
	);

	let uls = $("#" + model_for_id + "-collapse").find("ul");
	let learning_mechanics_ul = $(uls[0]);
	let game_mechanics_ul = $(uls[1]);
	let game_rule_designs_ul = $(uls[2]);

	let value = models[model];
	for (let subKey in value) {
		let subValue = value[subKey];
		let ulElement;
		switch (subKey) {
			case "Game mechanics":
				ulElement = game_mechanics_ul;
				break;
			case "Game rule designs":
				ulElement = game_rule_designs_ul;
				break;
			case "Learning mechanics":
				ulElement = learning_mechanics_ul;
				break;
		}
		subKey = subKey.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		for (let element of subValue) {
			ulElement.append(`<li><div class="form-check"><input onchange="toggleModelSelection(this)" class="form-check-input" type="checkbox" value="${model_for_id}-${element}" id="${subKey}-${element}"><label class="form-check-label" style="color:black; position: relative; top: -3px; padding-left: 5px; font-size:14px;" for="${subKey}-${element}">${element}</label></div></li>`)
		}
	}

}


function removeModelsSubmeasureDropdown(model_for_id) {
	let unprocessed_keys = Object.keys(models);
	let keys = unprocessed_keys;
	let model;
	for (let i = 0; i < unprocessed_keys.length; i++) {
		keys[i] = unprocessed_keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		if (keys[i] === model_for_id) {
			model = unprocessed_keys[i];
		}
	}
	$('.model-content-accordion-' + model_for_id).remove();
	$("#model-content-add-dropdown-button").siblings().append(`<li id="${model_for_id}" onclick="processModelMeasure(this)"><a class="dropdown-item" href="#">${model}</a></li>`);
}


function createPlayabilityRow(row_button, loading) {
	let invalid = false;

	if (!loading) {
		for (let sibling of $(row_button).parent().siblings()) {
			let child = $(sibling).children()[0];
			if ($(sibling).children().first().val() === '') {
				$(child).css("border-color", "red");
				invalid = true;
			} else {
				if (sibling === $(row_button).parent().siblings().first()[0]) {
					if ($(row_button).parent().siblings().first().children().first().val() < 1) {
						$(child).css("border-color", "red");
						invalid = true;
					} else {
						$(child).css("border-color", "#ced4da");
					}
				} else {
					$(child).css("border-color", "#ced4da");
				}
			}
		}
	}

	if (!invalid) {
		let tds = $(row_button).parent().siblings();
		let input_row = $($("#playability-content-add-record-button").closest("tr"));
		let row_number = input_row.next().children().first().text();
		let tr = `<tr></tr>`;
		$(input_row).after(tr);
		row_number = Number(row_number) + 1;
		let first_td = `<td><button value=${row_number} onclick="removePlayabilityRow(this)" class="btn btn-danger btn-sm"><span class="fas fa-trash" style="font-size:16px"></span>	${row_number}</button></td>`;
		let new_row = $(input_row).next();
		$(new_row).append(first_td);
		for (let td of tds) {
			$(td).children().first().attr("required", "required");
			$(new_row).append($(td).clone());
			$(td).children().first().removeAttr("required");
			$(td).children().first().val('');
		}
	}
}


function removePlayabilityRow(delete_button) {
	$(delete_button).closest("tr").remove();

	if ($("#playability-content").find('tr').length === 2) {
		let tr = $("#playability-content").find("tr")[1];

		for (let td of $(tr).children()) {
			$(td).children().first().attr("required", "required");
		}
	}
}


// Handle form logic for 'Flow Element of the Design' section
function processDesign(input_element) {
	// Get adjacent textarea element depending on the class of the input element
	let adjacent_textarea = $(input_element).hasClass('tools') ? $(input_element).closest("td").next().find("textarea") : $(input_element).closest("td").prev().find("textarea");
	if ($(input_element).val().length < 1) {
		adjacent_textarea.prop("disabled", false);
		adjacent_textarea.attr("required", true);
	}

	adjacent_textarea.val("");

	if (!adjacent_textarea.attr("disabled") && !$(input_element).val().length < 1) {
		adjacent_textarea.attr("disabled", true);
		adjacent_textarea.removeAttr("required");
	}
}


function toggleDashboardPage() {
	// Toggle visibility of saved games page
	if ($("#dashboard-saved-games").is(":hidden")) {
		location.reload();
	} else {
		$("#dashboard-saved-games").hide();
	}
	// Toggle visibility of dashboard page
	if ($("#dashboard-container-left").is(":hidden")) {
		$("#dashboard-container-left").show();
		$("#progress-bar-div").parent().show();
	}
}


function createNewGame() {
	deleteCookie('_game_id');
	deleteCookie('_latest_section');
	localStorage.removeItem('_game_data');
	current_game = {};
	// TODO: If user is logged in, generate new game id and save to cookie (validate with backend first)
	$("#dashboard-container-right").replaceWith(cleanDashboardClone.clone());
	removeAllStyling();
	addStyling("#introduction");
	toggleDashboardPage();
	$("#load-most-recent-game-button").hide();
	$("#import-game-button").hide();
	$("#page-switch-button").show();
}


function nameGame() {
	let name = $("#game-name").val();

	$.ajax({
		url: "/ajax-update-name",
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify({"gameuuid": getCookie("_game_id"), "name":name}),
		type: 'POST',
		success: function(response) {
			saved = true;
			$("#game-name-submit").text("Saved!");
			$("#game-name-submit").addClass("green");
			setTimeout(function(){
				$('#game-name-submit').removeClass("green").text("Save");
			}, 2000);
		},
		error: function(error) {
			saved = false;
			$("#game-name-submit").text("Failure!");
			$("#game-name-submit").removeClass("btn-seconday green");
			$("#game-name-submit").addClass("btn-danger");
			setTimeout(function() {
				$('#game-name-submit').removeClass("btn-danger").addClass("btn-secondary").text("Save");
			}, 5000);
	  	},
		async: true
	});
}


// Handle 'Theoretical Foundation' section modals
$("#foundationModal1Button").click(function(){
	$("#foundationModal1").modal('show');
});
$("#foundationModal2Button").click(function(){
	$("#foundationModal2").modal('show');
});
$("#foundationModal3Button").click(function(){
	$("#foundationModal3").modal('show');
});
$("#foundationModal4Button").click(function(){
	$("#foundationModal4").modal('show');
});
$("#foundationModal5Button").click(function(){
	$("#foundationModal5").modal('show');
});
$("#foundationModal6Button").click(function(){
	$("#foundationModal6").modal('show');
});
$(document).on('hidden.bs.modal', function () {
	disableBodyScroll();
});

