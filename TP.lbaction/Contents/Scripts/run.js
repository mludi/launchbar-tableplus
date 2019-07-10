// LaunchBar Action Script

function runWithString(argument) {
    return this.suggestions(argument);
}

function run() {
    return this.suggestions();
}

function suggestions(argument) {
    try {
        const connections = File.readPlist('~/Library/Application Support/com.tinyapp.TablePlus/Data/Connections.plist');
        const groups = File.readPlist('~/Library/Application Support/com.tinyapp.TablePlus/Data/ConnectionGroups.plist');

        let suggestions = [];
        let filteredConnections = [];
        if (argument && argument !== 'undefined') {
            filteredConnections = connections.filter(connection => connection.ConnectionName.toLowerCase().indexOf(argument.toLocaleLowerCase()) !== -1);
        } else {
            filteredConnections = connections;
        }


        filteredConnections.forEach(function (connection) {            
            const groupKey = groups.map(e => e.ID).indexOf(connection.GroupID);
            const group = groups[groupKey];
            const url = `tableplus://?id=${connection.ID}`;
            const title = `${connection.ConnectionName} » ${connection.Driver}`;
            const groupName = (group && group.Name !== 'undefined') ? group.Name : 'Ungrouped';
            const subTitle = `${groupName} » ${connection.Enviroment}`;

            const tablePlusObject = {
                title: title,
                icon: 'icon.png',
                url: url,
                alwaysShowsSubtitle: true,
                subtitle: subTitle
            };

            if (suggestions.includes(tablePlusObject)) {
                return;
            }

            suggestions.push(tablePlusObject);
        });

        return suggestions;

    } catch (exception) {
        LaunchBar.alert('Error while reading plist: ' + exception);
        return [];
    }
}
