Dashboard 1.3: Toggle Order Configuration
2014-09-09 04:23:48
Android,Pebble,Releases,Releases
---

Just released Dashboard 1.3!The major new feature in this version is the ability to dynamically re-order the toggles to suit your preference. The way this works involves selecting each position in an Android Spinner in the 'Configure' tab:![](/assets/import/media/2014/09/screenshot_2014-09-07-19-46-17.png?w=576) Each time a user makes a selection in one of the positions, the rest of the Spinner array is checked to look for a duplicate of the toggle the user has just chosen, and switches the two around. For example, if the user changes the Wi-Fi toggle to Autosync, the first toggle becomes Autosync and then the existing Autosync Spinner duplicate is changed to the only other missing toggle type - Wi-Fi!This means that the toggles can be any order possible, such as the examples below:![](/assets/import/media/2014/09/toggle-config.png)That's a total of P(8,8) = 40320! 
