var current_game = {};

var sections = ['introduction', 
				'profile', 
				'typology', 
				'characteristics', 
				'foundation', 
				'model', 
				'accessibility', 
				'design', 
				'instruction', 
				'playability', 
				'assessment', 
				'justification'];

var characteristics = {
	'Education Game': [
		'Memory tasks',
		'Perfection Impossible',
		'Controllers',
		'Customisable',
		'Know your target',
		'Start Simple'
	],
	'Design': [
		'Restrictions',
		'Acceptance',
		'Impede Creativity',
		'Group Size',
		'Restrictions are Good',
		'Fun',
		'Easier to Learn',
		'Real World',
		'Creative',
		'Visualise'
	],
	'Life of Game': [
		'Having an online',
		'Editors',
		'Modelling',
		'Intrinsically Rewarding',
		'Explore'
	],
	'Engagement': [
		'Entertaining',
		'Gameplay Exciting',
		'Don\'t Force Learning',
		'Real Life',
		'Teamwork',
		'Communication',
		'Debriefing',
		'Role Differentiation',
		'Common Goal',
		'Prevent Interruptions',
		'Group Size',
		'Incentive for Engagement',
		'Games a Good Tool'
	],
	'Assessment': [
		'Learn via Playing',
		'External Assessor',
		'Integrate Learning with Gameplay',
		'Anonymous Voting',
		'Focus on Learning Outcomes',
		'Use of Framework',
		'Use References',
		'More Instruction',
		'Assess Specific Skills',
		'Methods of assessment',
		'Peer Assessment',
		'Matching results with objectives',
		'Observation and discussion',
		'Change in Performance & Behaviours',
		'Challenges in achievement of learning outcomes'
	],
	'Mechanics': [
		'Time Pressure',
		'Teach Time Management',
		'Finish within time Limit',
		'Every Person Talk',
		'Moderators Time Management',
		'Facilitator',
		'Time Limits',
	],
	'Human Factor': [
		'Learn Different Opinions',
		'Prosocial Behaviours'
	],
	'Characteristics of a good game': [
		'Essence',
		'GOALS/OBJECTIVE',
		'Experimenting',
		'Achievement of outcomes',
		'Iterative process',
		'Ability of learners to understand the outcomes',
		'Integration of objectives with different game element',
		'Alternative means for achievement',
		'Fun Element',
		'Focus motivation for achievement',
		'Matching Requirements with goals',
		'Promotion of Autonomy',
		'Iterative Emergent Process',
		'Development of different skills',
		'Low risks',
		'Link theory with practice',
		'Promotes Co-Creation of game',
		'Opportunity for differentiation',
		'Ability of solve real world problems',
		'Developing attitude and mindset of learners',
		'Use of triadic perspective of learning',
		'Encourage innovative thinking',
		'Measureable learning outcomes',
		'Improves learning',
		'Creative activies',
		'Eliminates fear of failure',
		'Easily accessible'
	],
	'Social Skills': [
		'Adaptability',
		'Empathy',
		'Interactive',
		'Communication',
		'Teamwork'
	],
	'What is a failure?': [
		'Ability to complete task',
		'Fail as a team',
		'Not engaging',
		'Avoid Lack of communication'
	],
	'Rules': [
		'Easy Instruction',
		'Collective effort to solve problems',
		'Difficulty level',
		'Ability to bend the rules to win'
	],
	'Interaction': [
		'Platform for Collective acivity',
		'Enjoying the process',
		'Involves collaboration and teamwork'
	],
	'Applications of Games': [
		'Skills and competencies of target audience',
		'Creativity',
		'Problem Solving',
		'Risk Assessment',
		'Communication',
		'Critical thinking',
		'Lifelong learning',
		'Metacognitive awareness of leaners',
		'Assessing stake',
		'Decision making',
		'Negotiation',
		'Teamwork',
		'Adaptation & Recognising Patterns'
	],
	'Skills of Educators': [
		'Assessment of Processes and outcomes',
		'Learning from Process',
		'Mapping Learning outcome',
		'Learning how to engage learners and intervene'
	],
	'Inclusivity': [
		'Consult Students',
		'Incentives for students',
		'Game Around Interest',
		'Mechanics to Ensure Listening',
		'Ways they Learn',
		'Each state opinion',
		'Non-native Gamers',
		'Small Group (4-6)',
		'Innacurate Preconceptions',
		'Don\'t jump between ideas',
		'Know your target'
	],
	'Playtesting': [
		'Don\'t Expect Rule of Thumb',
		'Disability',
		'Information Transmission',
		'Agile Approach',
		'Focus Group',
		'Fun to Lose',
		'Adapt to Feedback',
		'No Pressure',
		'Want to Learn',
		'Replay-ability',
		'Customisability',
		'Simple',
		'Atomic Parameters',
		'Co-operation',
		'Custom Interface',
		'Common Ground'
	],
	'Sustainability of Games': [
		'Contextualising reusability',
		'Intermittent dicussion between sessions',
		'Co-creation of games',
		'Connecting overall gaming experiences',
		'Involving old students in new courses',
		'Replay-ability of the existing games that are naturally compounded of different stages',
		'Reusability of games'
	]
}


$(document).ready(function() {
	populateCharacteristicsDropdown();
	loadGameData();
});


function toggleSelection(button) {
	if ($(button).hasClass("green")) {
		$(button).removeClass("green");
		$(button).removeAttr("selected");

		if ($(button).closest("div").attr("id") === "typology-content") {
			$(button).closest("td").siblings().children().find("button").removeAttr("disabled");
		}
	} else {
		$(button).addClass("green");
		$(button).attr("selected", "");

		if ($(button).closest("div").attr("id") === "typology-content") {
			$(button).closest("td").siblings().children().find("button").attr("disabled", "");
		}
	}
};


function processSection(sectionID) {
	if (sectionID === "introduction") {
		unlockNextSection(sectionID);
	} else if (sectionID === "characteristics") {
		console.log("characteristics section");
		unlockNextSection(sectionID);
	} else if (sectionID === "foundation") {
		console.log("foundation section");
		unlockNextSection(sectionID);
	} else if (sectionID === "model") {
		console.log("model section");
		unlockNextSection(sectionID);
	} else if (sectionID === "accessibility") {
		console.log("accessibility section");
		unlockNextSection(sectionID);
	} else if (sectionID === "design") {
		console.log("design section");
		unlockNextSection(sectionID);
	} else if (sectionID === "instruction") {
		console.log("instruction section");
		unlockNextSection(sectionID);
	} else if (sectionID === "playability") {
		console.log("playability section");
		unlockNextSection(sectionID);
	} else if (sectionID === "assessment") {
		console.log("assessment section");
		unlockNextSection(sectionID);
	} else if (sectionID === "justification") {
		console.log("justification section");
		unlockNextSection(sectionID);
	} else {
		let selections = $("#" + sectionID + "-content").find(".green").map(function() {
			return this.id.split("-")[2];
		}).get();

		if (selections.length < 1) {
			$("#" + sectionID + "-content").find(".errorMessage").removeAttr("hidden");
			return;
		} else {
			$("#" + sectionID + "-content").find(".errorMessage").attr("hidden", "");

			if (current_game[sectionID]) {
				current_game[sectionID] = [];
			}

			current_game[sectionID] = selections;
			save = processGameData();

			if (save) {
				selections = [];
				unlockNextSection(sectionID);
			} else {
				alert("unable to save progress. Please contact support.");
			}
		}
	}
}


function loadGameData() {
	if (getCookie("_game_data") !== null) {
		jwt = getCookie("_game_data");
		current_game = parseJWT(jwt);

		if (!current_game) {
			return;
		}

		sections_keys = Object.keys(current_game);
		latestSection = sections_keys[sections_keys.length - 1];

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
	}
}


function processGameData() {
	let saved = '';
	deleteCookie("_game_data");
	$.ajax({
		url: '/ajax-autosave',
		contentType: "application/json;charset=utf-8",
		data: JSON.stringify({current_game}),
		type: 'POST',
		success: function(response) {
			saved = true;
		},
		error: function(error) {
			saved = false;
	  	},
		async: false
	});
	return saved;
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
	$('.list-group-item.list-group-item-action').removeClass('active').removeAttr('aria-current');
	$('.list-group-item.list-group-item-action').attr('disabled', true).css('background-color', 'lightgray');
	$('.dashboard-content').hide();
}


// Helper function to add styling to sections on page load
// Uses saved cookie data to determine which sections to add styling to
function addStyling(latestSection) {
	no_previous_sections = sections.indexOf(latestSection.split("#")[1]);
	for (let i = 0; i < no_previous_sections; i++) {
		$('#' + sections[i]).removeAttr('disabled style');
	}
	$('#progress-bar').attr('aria-valuenow', (no_previous_sections) * 8.33333333333).css('width', (no_previous_sections) * 8.33333333333 + '%');
	$(latestSection).removeAttr('disabled style').addClass('active').attr('aria-current', 'true');
	$(latestSection + '-content').show();
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

	if (currentSectionButton.children().val() === "0") {
		if (nextSectionButton.length !== 0) {
			currentSectionButton.removeClass('active').removeAttr('aria-current');
			nextSectionButton.removeAttr('disabled style');
			currentSectionButton.children().val(1);
			nextSectionButton.addClass('active').attr('aria-current', 'true');
			currentSectionContent.hide();
			nextSectionContent.show()
			incrementProgressBar();
		} else {
			$('#progress-bar').attr('aria-valuenow', 100).css('width', 100 + '%');
		}
	} else {
		// Change button styling
		currentSectionButton.removeClass('active').removeAttr('aria-current');
		nextSectionButton.addClass('active').attr('aria-current', 'true')
		// Change content section
		currentSectionContent.hide();
		nextSectionContent.show();
	}
}


// TODO: Add cookie functionality, remove redundant testing code (if (clickedButton.children().val() === "0"), etc.) 
// Handle dashboard list button clicks
$('.list-group-item').click(function() {
	let currentButton = $('.list-group-item.list-group-item-action.active');
	let clickedButton = $(this);
	let clickedButtonContent = clickedButton.attr('id') + '-content';

	$.ajax({
		url: '/ajax_handler',
		data: { "data": "TEST" },
		type: 'POST',
		success: function(response) {
			$('.dashboard-content').hide(); // Hide all content sections
			$('#' + clickedButtonContent).show(); // Show clicked content section
			currentButton.removeClass('active').removeAttr('aria-current'); // Remove active styling from previous button
			clickedButton.addClass('active').attr('aria-current', 'true') // Add styling to clicked button
		},		error: function(error) {
			console.error(error);
	  }
	});
});


// Populate dropdown options for 'Game Characteristics' section on click
function populateCharacteristicsDropdown() {
	let characteristics_keys = Object.keys(characteristics);
	let no_characteristics = characteristics_keys.length;
	for (let i = 0; i < no_characteristics; i++) {
		$("#characteristics-content-dropdown-button").siblings().append('<li id="'+ characteristics_keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '') +'" onclick=processCharacteristicMeasure(this)><a class="dropdown-item" href="#">' + characteristics_keys[i] + '</a></li>')
	}
};


// Handle main dropdown option clicks in 'Game Characteristics' section
function processCharacteristicMeasure(characteristic) {
	let unprocessed_keys = Object.keys(characteristics);
	let keys = Object.keys(characteristics);
	for (let i = 0; i < keys.length; i++) {
		keys[i] = keys[i].replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
		if (keys[i] === $(characteristic).attr('id')) {
			createCharacteristicsSubmeasureDropdown(keys[i], unprocessed_keys[i], i);
		}
	}
	$(characteristic).remove();
}


// Create submeasure dropdowns for 'Game Characteristics' section when pressed
function createCharacteristicsSubmeasureDropdown(characteristic_for_id, characteristic, index) {
	$('#characteristics-content-accordion-row').prepend('<div class="dropdown"><button id="characteristics-content-accordion-' + characteristic_for_id + '" class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">' + characteristic + '</button><ul class="dropdown-menu"><div class="dropdown-item form-check"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1"><label class="form-check-label" for="defaultCheck1">Option 1</label></div></ul></div>');
}
