import { RNKeycloak } from '@react-keycloak/native';

const keycloak = new RNKeycloak({
    url: 'http://192.168.10.98:8080/auth/realms/Test/protocol/openid-connect/auth',
    realm: 'Test',
    clientId: 'GoBus',
});

export default keycloak;