import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

import { Button } from '@/componentes/Button';

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const googleOAuth = useOAuth({ strategy: 'oauth_google'});

  async function onGoogleSingIn() {
    try {
      setIsLoading(true);

      const redirectUrl = Linking.createURL("/");

      const oAuthFlow = await googleOAuth.startOAuthFlow({redirectUrl});

      if(oAuthFlow.authSessionResult?.type === 'success') {
        if(oAuthFlow.setActive) {
          await oAuthFlow.setActive({session: oAuthFlow.createdSessionId })
        }
      } else {
        setIsLoading(false)
      }

    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <Button icon='logo-google' title='Entrar com o Google' isLoading={isLoading} onPress={() => onGoogleSingIn()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
})