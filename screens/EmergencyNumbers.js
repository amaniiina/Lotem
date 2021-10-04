import React, { Component } from "react";
import { View, ListItem, List, Body } from "native-base";
import { Text, StyleSheet, ScrollView } from "react-native";

class Emergency extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text style={st.Text_style}>אנחנו לא נשות טיפול ואין לנו כלים מקצועיים לעזור למצוקות רבות. ראו רשימת עמותות רלוונטיות להן כלים לעזור, במקרי אלימות ואלימות מינית:</Text>
                <View style={st.List_style}>
                    <ScrollView>
                        <List>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list} > מרכזי סיוע לאלימות מינית: 1202  </Text>
                                    <Text style={st.Text_list} >  נשים ערביות: 04-6566813  </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}>http://www.itach.org.il/ 1-700-50-50-65: עמותת איתך- مَعَكِ</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> נשים דתיות : 02-6730002</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 04-6566813 : נשים ערביות</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 02-5328000 : גברים דתיים</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}>052-8361202 : סיוע בווטסאפ</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 09-8651386 : בית אלה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 118 : ייעוץ ראשוני - קו חם של משרד הרווחה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}>1-800-39-39-04 : קו חירום לנשים מוכות ויצו </Text>
                                </Body>
                            </ListItem>

                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}>1-800-292-333 : עמותת בת מלך - סיוע לנשים דתיות </Text>
                                </Body>
                            </ListItem>

                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 04-8533044 : السوار -  תנועה פמיניסטית ערבית </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 09-9518927 : ילדים במצוקה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 09-7747760, 09-7412858 : קש”ב - קו שירות לנשים במצוקה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> *3090 :  המרכז לטיפול ומניעת אלימות במשפחה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 1-800-220-000 : קו חירום לנפגעי אלימות במשפחה </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 02-6710095 : מקלט לגברים אלימים </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 054-3008036 : קו חירום לנפגעות סחר בנשים </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> ASWAT - Queer Palestinian Women : 04-8662357 </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 02-6712282 : מבוי סתום - עזרה למסורבות גט ועגונות </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 1201 :  ער”ן - עזרה נפשית ראשונית עברית וערבית</Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> 02-6446525 : אמירים - בית לנערות ונשים בהריון </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}> *6935 : אל”י - האגודה להגנת הילד מפני התעללות פיזית </Text>
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text style={st.Text_list}>03-5164621/2071 : בית דרור - מרכז חירום לנערים ונערות להט”בים </Text>
                                </Body>
                            </ListItem>
                        </List>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

export default Emergency;

const st = StyleSheet.create(
    {
        Text_style: {
            marginTop: 30,
            textAlign: 'center',
            fontSize: 22,
            color: '#5d5d5d',
            fontFamily: 'Segoe UI',
            fontWeight: 'bold',
        },
        List_style: {
            marginTop: 10,
            height: '75%',
            width: '100%',
        },
        Text_list: {
            fontSize: 16,
            fontFamily: 'Segoe UI',
            fontWeight: 'bold',
        }
    }
);