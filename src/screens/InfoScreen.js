import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { useTranslation } from 'react-i18next'; 

const faqImage = require('../../assets/FAQ.png');
const { height, width } = Dimensions.get('window');

const IconRow = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.iconRow}>
      <View style={styles.iconWithText}>
        <Ionicons name='star' size={24} color='black' style={styles.icon} />
        <Text style={styles.iconText}>{t('ui_30_points')}</Text>
      </View>
      <View style={styles.iconWithText}>
        <Ionicons name='trophy' size={24} color='black' style={styles.icon} />
        <Text style={styles.iconText}>{t('ui_60_points')}</Text>
      </View>
      <View style={styles.iconWithText}>
        <Ionicons name='diamond' size={24} color='black' style={styles.icon} />
        <Text style={styles.iconText}>{t('ui_100_points')}</Text>
      </View>
    </View>
  );
};

export default function InfoScreen() {
  const { t } = useTranslation();

  return (
    <GradientBackground statusBarStyle="dark">
      <View style={styles.header}>
        <Text style={{fontSize:48, fontWeight:'600', color: 'black',fontStyle:'italic'}}>FAQ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>

          <View style={[styles.box, styles.box1]}>
            <Text style={styles.boxTitle}>{t('ui_how_to_earn_points')}</Text>
            <Text style={styles.subtitle}>{t('ui_earn_points_description')}</Text>
          </View>

          <View style={[styles.box, styles.box2]}>
            <Text style={styles.boxTitle}>{t('ui_three_stages')}</Text>
            <Text
              style={[styles.subtitle, { fontSize: 14, flexWrap: 'wrap' }]}
            >
              {t('ui_milestones_description')}
            </Text>
            <IconRow />
          </View>

          <View style={[styles.box, styles.box3]}>
            <Text style={styles.boxTitle}>{t('ui_why_earn_points')}</Text>
            <Text style={styles.subtitle}>{t('ui_why_earn_description')}</Text>
          </View>

          <View style={[styles.box, styles.box4]}>
            <Text style={styles.boxTitle}>{t('ui_do_points_expire')}</Text>
            <Text style={styles.subtitle}>{t('ui_points_expire_description')}</Text>
          </View>

          <View style={[styles.contactBox, styles.box]}>
            <Text style={styles.boxTitle}>{t('ui_contact_us')}</Text>
            <Text style={styles.contactSubtitle}>{t('ui_contact_description')}</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>{t('ui_email')}: </Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:tastyoulu@bestcompany.com')}>
                <Text style={styles.linkText}>tastyoulu@bestcompany.com</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>{t('ui_phone')}: </Text>
              <TouchableOpacity onPress={() => Linking.openURL('tel:+358401231234')}>
                <Text style={styles.linkText}>+358 40 1231234</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom:20
  },
  image: {
    width: 305,
    height: 159,
    resizeMode: 'contain',
  },
  box: {
    width: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 20,
    marginBottom: 20,
  },
  box1: {
    backgroundColor: '#9859FC',
  },
  box2: {
    backgroundColor: '#FF74AB',
  },
  box3: {
    backgroundColor: '#FAD160',
  },
  box4: {
    backgroundColor: '#a1c45a',
},
  boxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 20,
  },
  iconRow: {
    flexDirection: 'column',
    width: '100%',
    paddingTop: 10,
    alignItems: 'center',
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  icon: {
    marginBottom: 5,
    marginRight: 10,
  },
  iconText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    alignContent: 'center',
    textAlign: 'center',
  },
  contactBox: {
    backgroundColor: '#C9E4E7',
    padding: 20,
    borderRadius: 10,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    marginTop: 5,
    paddingTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
